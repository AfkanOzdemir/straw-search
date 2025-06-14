import fetch from 'node-fetch';
import { load } from 'cheerio';
import fs from 'fs/promises';
import ora from 'ora';
import type { CrawlerOptions, CrawlerResult } from './types/crawler.d.ts';
const visited = new Set<string>();

export async function crawlSite(options: CrawlerOptions) {
  const { rootUrl, outputFile } = options;
  const spinner = ora({
    text: `Scanning: ${rootUrl}`,
    spinner: 'dots',
    color: 'cyan'
  }).start();
  
  const queue: string[] = [rootUrl];
  const results: CrawlerResult[] = [];
  let processedCount = 0;

  while (queue.length > 0) {
    const currentUrl = queue.pop();
    if (!currentUrl || visited.has(currentUrl)) continue;

    visited.add(currentUrl);
    processedCount++;
    
    spinner.text = `Scanning: ${currentUrl} (${processedCount} pages scanned, ${queue.length} pages left)`;

    try {
      const res = await fetch(currentUrl);
      const html = await res.text();
      const $ = load(html);
      const text = $('body').text().replace(/\s+/g, ' ').trim();

      // Başlık etiketlerini toplama (h1-h6)
      const h1Elements = $('h1')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
      
      const h2Elements = $('h2')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
      
      const h3Elements = $('h3')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
        
      const h4Elements = $('h4')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
        
      const h5Elements = $('h5')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
        
      const h6Elements = $('h6')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
      
      // Paragraf etiketlerini toplama
      const pElements = $('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
        
      // Liste öğelerini toplama
      const liElements = $('li')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);
        
      // Link etiketlerini toplama
      const aElements = $('a')
        .map((_, el) => ({
          text: $(el).text().trim(),
          href: $(el).attr('href') || ''
        }))
        .get()
        .filter(item => item.text.length > 0 || item.href.length > 0);

      results.push({ 
        url: currentUrl, 
        h1: h1Elements,
        h2: h2Elements,
        h3: h3Elements,
        h4: h4Elements,
        h5: h5Elements,
        h6: h6Elements,
        p: pElements,
        li: liElements,
        a: aElements,
        text 
      });

      const links = $('a')
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter(Boolean)
        .map((href) => {
          if (href!.startsWith('/')) return new URL(href!, rootUrl).href;
          return href!;
        })
        .filter((link) => link.startsWith(rootUrl) && !visited.has(link));

      if (links.length > 0) {
        spinner.text = `Scanning: ${currentUrl} (${links.length} new links found)`;
      }

      queue.push(...links);
    } catch (error: any) {
      spinner.warn(`❌ Skipped: ${currentUrl}: ${error.message}`);
      spinner.start();
    }
  }

  spinner.succeed(`✅ Process completed! ${results.length} pages scanned.`);
  
  await fs.writeFile(outputFile, JSON.stringify(results), 'utf-8');
  console.log(`📄 Results saved to: ${outputFile}`);
}
