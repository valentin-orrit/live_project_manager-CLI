import { uncompress } from './lib/uncompress.js'
import { parse } from './lib/parse.js'
import chalk from 'chalk'


async function main() {
    try {
        await uncompress()
        console.log(chalk.green('Uncompression Completed. Parsing...'))
        await parse()
        console.log(chalk.green('Process Parsing Completed.'))
    } catch (error) {
        console.error(chalk.red('An error occurred:'), error)
    }
}

main()