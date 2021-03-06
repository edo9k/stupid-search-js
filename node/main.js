﻿const book = require('./dom-casmurro')

replaceBrChars = async t => t
  .replace(/[áàãâä]/ui, 'a')
  .replace(/[éèêë]/ui, 'e')
  .replace(/[íìîï]/ui, 'i')
  .replace(/[óòõôö]/ui, 'o')
  .replace(/[úùûü]/ui, 'u')
  .replace(/[ç]/ui, 'c')
//  .replace(/[^a-z0-9]/i, '_')
//  .replace(/_+/, '_')

clean = async t => await replaceBrChars(t.toLowerCase())

query = w => new RegExp(w, 'gi')
  
search = async (q, s) => {
  const a = Date.now()
  const indices = []
  let regex = await replaceBrChars(q.toLowerCase())
  regex = query(regex)
  let result = null

  while ((result = regex.exec(s))) {
    indices.push(result.index)

    console.log(`
      ...${book.text.substring(result.index - 50, result.index + 50)}...
      (encontrado em ${ (Date.now() - a) / 1000 } segundo/s)
      --- ---
    `)

  }
  console.log(` 
  ----------------------
  ${indices.length} resultados encotrados. 
  `)
}


(async () => {
  const rawargs = process.argv
  const args = rawargs.slice(2)
  const searchText = await clean(book.text.toLowerCase())


  const searchQuery = args
    .map(x => x.toString().trim())
    .join(' ')


  if (typeof searchQuery === 'string'
      && searchQuery.trim() !== ''
      && searchQuery.length > 3 ) {
    await search( searchQuery, searchText )
  } else {
    console.error(`
      Search queries must be:
        - String type (text)
        - Non empty
        - Longer than 3 characters

      Please try again.
    `)
  }


  console.log(` 
      --- ---
      searchQuery ----------------------  ${ searchQuery}
      searchQuery sanitized ------------  ${ await replaceBrChars(searchQuery.toLowerCase())}
      && typeof searchQuery === 'string'  ${ typeof searchQuery === 'string'}
      && searchQuery.trim() !== '' -----  ${ searchQuery.trim() !== '' }
      && searchQuery.length > 2 --------  ${ searchQuery.length > 2 }
  `)


})()
