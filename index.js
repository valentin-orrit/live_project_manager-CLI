#!/usr/bin/env node

import { program } from "commander"
import { uncompress } from './lib/uncompress.js'
import { parse } from './lib/parse.js'
import { xmlDelete } from './lib/xml-delete.js'
import { log } from './lib/logger.js'
import chalk from 'chalk'

program
  .version("1.0.0")
  .description("ALS File Processor CLI")

program
  .command('process <directory>')
  .description('Uncompress and parse ALS files in the specified directory')
  .action(async (directory) => {
    try {
      console.log('Uncompressing...')
      await uncompress(directory)
      console.log(chalk.green('Uncompression Completed'))
      console.log('Parsing...')
      await parse(directory)
      console.log(chalk.green('Parsing Completed.'))
      console.log(chalk.green.bold('Processing completed successfully.'))
    } catch (error) {
      await log(`An error occurred: ${error}`)
      console.error(chalk.red('Processing failed:'), error.message)
    }
  })

program
  .command('delete <directory>')
  .description('Delete XML files in the specified directory')
  .action(async (directory) => {
    try {
      await xmlDelete(directory)
      console.log(chalk.green.bold('XML deletion completed successfully.'))
    } catch (error) {
      console.error('XML deletion failed:', error.message)
    }
  })

program.parse(process.argv)