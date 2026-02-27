/**
 * 梦幻西游官网门派技能爬虫
 * 数据来源: https://xyq.163.com/mptz/
 *
 * 使用方法: npx ts-node scripts/crawl-mhxy-skills.ts
 */

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite';

interface SkillData {
  name: string;
  description: string;
  type: string;
  mpCost?: number;
  hpRequirement?: string;
  conditions?: string;
  effects?: string[];
}

interface FactionData {
  id: string;
  name: string;
  race: string;
  description: string;
  skills: SkillData[];
  features: string[];
  restraint: {克制: string; 被克: string};
}

// 门派ID映射（20个门派，官网显示20个）
// 旧门派使用 mp0xx 格式，新门派使用完整URL
const FACTION_IDS: Record<string, string> = {
  // 人族门派（6个）
  大唐官府: 'mp001',
  化生寺: 'mp003',
  方寸山: 'mp002',
  女儿村: 'mp004',
  神木林: 'mp015',
  天机城: '20180428/4999_752210',
  // 仙族门派（6个）- 注意：mp005=天宫，mp006=龙宫
  龙宫: 'mp006',
  普陀山: 'mp008',
  五庄观: 'mp007',
  天宫: 'mp005',
  凌波城: 'mp013',
  花果山: '20180428/4999_752212',
  // 魔族门派（6个）
  狮驼岭: 'mp009',
  魔王寨: 'mp010',
  阴曹地府: 'mp011',
  盘丝洞: 'mp012',
  无底洞: 'mp014',
  女魃墓: '20180201/4999_738722',
  // 奇遇门派（2个）
  东海渊: '20210524/4999_949686',
  九黎城: '20230714/4999_1098832',
};

// 门派页面URL
const BASE_URL = 'https://xyq.163.com';

/**
 * HTTP请求封装 - 支持GBK编码
 */
function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
      },
      res => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          // 尝试检测编码，梦幻西游官网使用GBK
          const html = iconv.decode(buffer, 'gbk');
          resolve(html);
        });
      }
    ).on('error', reject);
  });
}

/**
 * 解析门派页面HTML
 */
function parseFactionPage(html: string, factionId: string): FactionData | null {
  try {
    // 提取门派名称
    const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/) ||
      html.match(/门派[：:]\s*([^\n<]+)/);
    const name = nameMatch ? nameMatch[1].trim() : factionId;

    // 提取门派描述
    const descMatch = html.match(/<div[^>]*class="[^"]*intro[^"]*"[^>]*>([\s\S]*?)<\/div>/) ||
      html.match(/门派简介[：:]\s*([\s\S]*?)(?:\n\n|<\/p>|技能)/);
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // 提取技能列表
    const skills: SkillData[] = [];

    // 辅助函数：从2列表格中提取技能
    function extractSkillsFromTable(tableHtml: string, skillType: 'active' | 'passive'): void {
      // 匹配表格行：<tr><td>名称</td><td>描述</td></tr> 或更多列
      const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
      let rowMatch;
      while ((rowMatch = rowPattern.exec(tableHtml)) !== null) {
        const rowContent = rowMatch[1];
        // 提取所有列
        const colPattern = /<td[^>]*>([\s\S]*?)<\/td>/g;
        const cols: string[] = [];
        let colMatch;
        while ((colMatch = colPattern.exec(rowContent)) !== null) {
          cols.push(colMatch[1].replace(/<[^>]+>/g, '').trim());
        }

        // 2列表格（法术名称 | 法术介绍）
        if (cols.length === 2) {
          const col1 = cols[0];
          const col2 = cols[1];

          // 判断哪列是技能名，哪列是描述
          let skillName: string;
          let skillDesc: string;

          // 如果第一列包含"功效"，则交换列
          if (col1.includes('功效') || col1.includes('使用条件')) {
            skillName = col2;
            skillDesc = col1;
          } else {
            skillName = col1;
            skillDesc = col2;
          }

          // 过滤无效数据
          if (skillName && skillDesc &&
              skillName !== '法术名称' &&
              skillName !== '技能名称' &&
              skillName !== '学习效果' &&
              skillName.length >= 2 &&
              skillName.length <= 20 &&
              !skillName.includes('&nbsp;') &&
              (skillDesc.includes('功效') || skillDesc.includes('效果') || skillDesc.includes('使用条件')) &&
              !skills.find(s => s.name === skillName)) {
            skills.push({
              name: skillName,
              description: skillDesc,
              type: skillType,
              mpCost: extractMpCost(skillDesc),
              hpRequirement: extractHpRequirement(skillDesc),
              conditions: extractConditions(skillDesc),
            });
          }
        }
      }
    }

    // 方法1: 提取门派法术表格（2列：法术名称 | 法术介绍）
    const spellTableMatch = html.match(/门派法术[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/i);
    if (spellTableMatch) {
      extractSkillsFromTable(spellTableMatch[1], 'active');
    }

    // 方法2: 如果方法1没有找到主动技能，尝试查找所有包含"功效"的表格
    if (skills.filter(s => s.type === 'active').length === 0) {
      const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi);
      if (tables) {
        for (const table of tables) {
          if (table.includes('功效')) {
            extractSkillsFromTable(table, 'active');
          }
        }
      }
    }

    // 方法3: 提取门派技能表格（被动技能）
    const skillTableMatch = html.match(/门派技能[：:]*[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/);
    if (skillTableMatch) {
      const tableContent = skillTableMatch[1];
      // 匹配3列表格行：<tr><td>技能名称</td><td>学习效果</td><td>包含法术</td></tr>
      const rowPattern = /<tr[^>]*>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/g;
      let match;
      while ((match = rowPattern.exec(tableContent)) !== null) {
        const skillName = match[1].replace(/<[^>]+>/g, '').trim();
        const learningEffect = match[2].replace(/<[^>]+>/g, '').trim();
        const containsSpells = match[3].replace(/<[^>]+>/g, '').trim();

        // 过滤表头和无效数据
        if (skillName && skillName !== '技能名称' &&
            skillName.length >= 2 &&
            skillName.length <= 20 &&
            !skillName.includes('&nbsp;') &&
            !skills.find(s => s.name === skillName)) {
          skills.push({
            name: skillName,
            description: learningEffect + (containsSpells && containsSpells !== '——' ? ` 包含法术: ${containsSpells}` : ''),
            type: 'passive',  // 门派技能通常是被动效果
            mpCost: 0,
          });
        }
      }
    }

    // 提取门派特点
    const features: string[] = [];
    const featureMatch = html.match(/门派特色[：:]\s*([^\n<]+)/) ||
      html.match(/特点[：:]\s*([^\n<]+)/);
    if (featureMatch) {
      features.push(featureMatch[1].trim());
    }

    // 提取克制关系
    let restraint = {克制: '', 被克: ''};
    const restraintMatch = html.match(/克制[：:]\s*([^\n<]+)/);
    if (restraintMatch) {
      restraint.克制 = restraintMatch[1].trim();
    }

    // 判断种族 - 根据门派ID和名称判断
    let race = 'human';
    const celestialFactions = ['mp005', 'mp006', 'mp007', 'mp008', 'mp013', '20180428/4999_752212'];
    const demonFactions = ['mp009', 'mp010', 'mp011', 'mp012', 'mp014', '20180201/4999_738722'];

    if (celestialFactions.includes(factionId)) {
      race = 'celestial';
    } else if (demonFactions.includes(factionId)) {
      race = 'demon';
    }

    return {
      id: factionId,
      name,
      race,
      description,
      skills,
      features,
      restraint,
    };
  } catch (error) {
    console.error(`解析门派页面失败: ${factionId}`, error);
    return null;
  }
}

/**
 * 提取MP消耗
 */
function extractMpCost(text: string): number | undefined {
  const mpMatch = text.match(/消耗[：:]\s*(\d+)\s*点?\s*(?:魔法|MP)/i) ||
    text.match(/(\d+)\s*点?\s*(?:魔法|MP)/i);
  return mpMatch ? parseInt(mpMatch[1]) : undefined;
}

/**
 * 提取HP要求
 */
function extractHpRequirement(text: string): string | undefined {
  const hpMatch = text.match(/HP[>＞]\s*(\d+)%/) ||
    text.match(/气血[>＞]\s*(\d+)%/) ||
    text.match(/当前HP[>＞]\s*(\d+)%/);
  return hpMatch ? `${hpMatch[1]}%` : undefined;
}

/**
 * 提取使用条件
 */
function extractConditions(text: string): string | undefined {
  const condMatch = text.match(/使用条件[：:]\s*([^\n。]+)/) ||
    text.match(/学习条件[：:]\s*([^\n。]+)/);
  return condMatch ? condMatch[1].trim() : undefined;
}

/**
 * 爬取单个门派数据
 */
async function crawlFaction(factionId: string, factionName: string): Promise<FactionData | null> {
  const url = `${BASE_URL}/${factionId}.html`;
  console.log(`正在爬取: ${factionName} (${url})`);

  try {
    const html = await fetch(url);
    const data = parseFactionPage(html, factionId);

    if (data) {
      data.name = factionName; // 使用已知名称
      console.log(`  ✓ 获取到 ${data.skills.length} 个技能`);
    }

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));

    return data;
  } catch (error) {
    console.error(`  ✗ 爬取失败: ${factionName}`, error);
    return null;
  }
}

/**
 * 爬取所有门派数据
 */
async function crawlAllFactions(): Promise<FactionData[]> {
  console.log('=== 开始爬取梦幻西游门派数据 ===\n');

  const results: FactionData[] = [];

  for (const [name, id] of Object.entries(FACTION_IDS)) {
    const data = await crawlFaction(id, name);
    if (data) {
      results.push(data);
    }
  }

  console.log(`\n=== 爬取完成，共获取 ${results.length} 个门派数据 ===`);
  return results;
}

/**
 * 保存数据到JSON文件
 */
function saveToJson(data: FactionData[], outputPath: string): void {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputPath, json, 'utf8');
  console.log(`数据已保存到: ${outputPath}`);
}

/**
 * 生成Markdown文档
 */
function generateMarkdown(data: FactionData[], outputPath: string): void {
  let md = `# 梦幻西游门派技能数据

> 数据来源: 梦幻西游官网 (xyq.163.com)
> 爬取时间: ${new Date().toLocaleString('zh-CN')}

---

`;

  // 按种族分组
  const grouped: Record<string, FactionData[]> = {
    人族: data.filter(f => f.race === 'human'),
    仙族: data.filter(f => f.race === 'celestial'),
    魔族: data.filter(f => f.race === 'demon'),
  };

  for (const [race, factions] of Object.entries(grouped)) {
    md += `## ${race}门派\n\n`;

    for (const faction of factions) {
      md += `### ${faction.name}\n\n`;
      md += `**门派定位**: ${faction.features.join('、') || '待补充'}\n\n`;

      if (faction.description) {
        md += `**门派简介**: ${faction.description}\n\n`;
      }

      if (faction.skills.length > 0) {
        md += `| 技能名称 | 描述 | MP消耗 | 条件 |\n`;
        md += `|---------|------|--------|------|\n`;

        for (const skill of faction.skills) {
          const mp = skill.mpCost ? `${skill.mpCost}` : '-';
          const cond = skill.conditions || '-';
          md += `| ${skill.name} | ${skill.description.substring(0, 50)}${skill.description.length > 50 ? '...' : ''} | ${mp} | ${cond} |\n`;
        }
        md += '\n';
      }

      if (faction.restraint.克制) {
        md += `**克制**: ${faction.restraint.克制}\n\n`;
      }

      md += '---\n\n';
    }
  }

  fs.writeFileSync(outputPath, md, 'utf8');
  console.log(`Markdown文档已生成: ${outputPath}`);
}

/**
 * 主函数
 */
async function main() {
  try {
    const data = await crawlAllFactions();

    // 确保输出目录存在
    const outputDir = path.join(process.cwd(), 'docs', 'mhxy-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {recursive: true});
    }

    // 保存JSON
    saveToJson(data, path.join(outputDir, 'factions.json'));

    // 生成Markdown
    generateMarkdown(data, path.join(outputDir, 'factions.md'));

    // 打印摘要
    console.log('\n=== 数据摘要 ===');
    for (const faction of data) {
      console.log(`${faction.name}: ${faction.skills.length} 个技能`);
    }
  } catch (error) {
    console.error('爬虫执行失败:', error);
    process.exit(1);
  }
}

// 执行
main();
