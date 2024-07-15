let ascii = `
██ ██████  ██ 
██ ██   ██ ██ 
██ ██████  ██ 
██ ██   ██ ██ 
██ ██████  ██
`
console.log(ascii)
document.querySelector('meta[name="theme-color"]').setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bs-primary'));