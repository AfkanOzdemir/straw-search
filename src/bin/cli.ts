#!/usr/bin/env node
import { Command } from 'commander';
import { crawlSite } from '../crawler.js';

const program = new Command();

program
  .name('straw-search')
  .description('Search for a keyword in a site')
  .argument('<url>', 'Root URL to crawl')
  .option('-o, --output <file>', 'Output file path', 'index.json')
  .action(async (url: string, options: { output: string }) => {
    await crawlSite({ rootUrl: url, outputFile: options.output });
  });

program.parse();
