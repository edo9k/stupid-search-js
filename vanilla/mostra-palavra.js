/*
 * @prettier
 */

getWordParam = () => {
  const params = new URLSearchParams(window.location.search)

  const preambule = params.get('preambule')
  const word = params.get('word')

  return { preambule, word }
}

jumpToWord = (preambule, word) => {
  const options = [
    (aCaseSensitive = false),
    (aBackwards = false),
    (aWrapAround = true),
    (aWholeWord = false),
    (aSearchInFrames = true),
    (aShowDialog = true)
  ]

  console.log(decodeURIComponent(preambule))

  window.find(decodeURIComponent(preambule), ...options)
  window.find(decodeURIComponent(word), ...options)
}

document.addEventListener('DOMContentLoaded', () => {
  const params = getWordParam()

  jumpToWord(params.preambule, params.word)
})
