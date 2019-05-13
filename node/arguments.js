/*
 * Chosen strategy to deal with cli arguments
 *
 */

const _args = process.argv
const args = _args.slice(2)

console.log(args.join(' '))
