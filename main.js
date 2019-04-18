const book = require('./dom-casmurro')

query = w => new RegExp(w, 'gi')

search = s => {
  const a = Date.now()
  const indices = []
  const regex = query(s)
  let result = null

  while ((result = regex.exec(book.text))) {
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

search('mulher')
