#!/usr/bin/env node
import { Command } from 'commander';
import { crawlSite } from '../crawler.js';

const program = new Command();

program
  .name('crawler')
  .description('Crawl a website and generate a searchable index')
  .version('1.0.0')
  .argument('<url>', 'Root URL to crawl')
  .option('-o, --output <file>', 'Output file path', 'index.json')
  .action(async (url: string, options: { output: string }) => {
    console.log(`🔍 Crawling ${url} and saving results to ${options.output}`);
    await crawlSite({ rootUrl: url, outputFile: options.output });
  });

program.parse();
