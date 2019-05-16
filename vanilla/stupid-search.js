/*
 * @prettier
 */

let book = {}

const replaceBrChars = async text =>
  text
    .replace(/[áàãâä]/iu, 'a')
    .replace(/[éèêë]/iu, 'e')
    .replace(/[íìîï]/iu, 'i')
    .replace(/[óòõôö]/iu, 'o')
    .replace(/[úùûü]/iu, 'u')
    .replace(/[ç]/iu, 'c')
// .replace(/[^a-z0-9]/i, '_')
// .replace(/_+/, '_')

const clean = async t => await replaceBrChars(t.toLowerCase())

const queryRegex = w => new RegExp(w, 'gi')

const search = async (searchQuery, corpus) => {
  if (!searchQuery) console.error('DEU RUIM')

  if (!corpus.cleanText && !corpus.text) {
    console.log(`

    text      -  ${corpus.text /*.substring(500, 550)*/}
    cleanText -  ${corpus.cleanText /*.substring(500, 550)*/}

    `)
    corpus.cleanText = await clean(corpus.text)
  }

  searchQuery = await clean(searchQuery)
  searchQuery = queryRegex(searchQuery)

  const indices = []
  let result = null

  addSection(corpus.subtitulo) // mudar para corpus.titulo

  while ((result = searchQuery.exec(corpus.cleanText))) {
    indices.push(result.index)

    addResult(
      `...${corpus.text.substring(result.index - 20, result.index + 20)}...`,
      `${corpus.arquivo}?preambule=${corpus.text.substring(result.index - 20, result.index - 1)}&word=${searchQuery}`
    )
  }
}

const cleanResults = () => {
  let node = document.getElementById('result')
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

const addResult = (text, link) => {
  const item = document.createElement('li')
  const itemText = document.createTextNode(text)

  const a = document.createElement('a')
  const aText = document.createTextNode('[ir]')
  a.appendChild(aText)
  a.title = 'pular para esse trecho'
  a.href = link

  item.appendChild(itemText)
  item.appendChild(a)

  document.getElementById('result').appendChild(item)
}

const addSection = text => {
  const item = document.createElement('h2')
  const itemText = document.createTextNode(text)

  item.appendChild(itemText)

  document.getElementById('result').appendChild(item)
}

const setParam = w => {
  let params = new URLSearchParams(window.location.search)

  params.set('query', w)
  history.pushState(null, `Pesquisa: ${w}`, `?query=${params.get('query')}`)
}

const getParam = () => {
  let params = new URLSearchParams(window.location.search)

  return params.get('query')
}

const main = async () => {
  // setup inputs
  document.getElementById('searchButton').onclick = async () => {
    let query = document.getElementById('searchText').value

    cleanResults()
    setParam(query)
    await search(query, book.text)
  }

  document.getElementById('searchText').addEventListener('keyup', event => {
    event.preventDefault()
    if (event.keyCode === 13) {
      document.getElementById('searchButton').click()
    }
  })

  // load all texts
  const doc = await fetch('./dom-casmurro.html')
  const text = await doc.text()

  let files

  try {
    const jsonFile = await fetch('./capitulos.json')
    files = await jsonFile.json()
  } catch (e) {
    console.error({ message: 'Erro ao carregar arquivo de descrição de capítulos (capitulos.json)', error: e })
  }

  try {
    files
      .map(x => x.arquivo)
      .forEach(async (arquivo, i) => {
        const response = await fetch(arquivo)
        files[i].text = await response.text()
      })
  } catch (e) {
    console.error({ message: 'Erro ao carregar os capítulos do livro.', error: e })
  }

  console.log(files[0].text)

  book.url = './dom-casmurro.html'
  book.text = text

  const urlQuery = getParam()
  if (urlQuery) {
    document.getElementById('searchText').value = urlQuery
    setTimeout(() => console.log('plz kill me' + Date.now()), 500)
    setTimeout(async () => {
      await search(urlQuery, files[0])
    }, 2000)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await main()
})

/*

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

        searchQuery ----------------------  ${ searchQuery}
        searchQuery sanitized ------------  ${ await replaceBrChars(searchQuery.toLowerCase())}
        && typeof searchQuery === 'string'  ${ typeof searchQuery === 'string'}
        && searchQuery.trim() !== '' -----  ${ searchQuery.trim() !== '' }
        && searchQuery.length > 2 --------  ${ searchQuery.length > 2 }

    */
