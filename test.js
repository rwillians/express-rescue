const rescue = require('./')

const errorHandler = (err) => {
    console.log(err.message)
    process.exit(1)
}

const somethingWrong = () => {
    throw new Error('Ops')
}

const callable = rescue(somethingWrong)

callable(errorHandler)
