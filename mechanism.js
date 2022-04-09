const dbDocument = {
    firstname: 'John',
}
const extend = {
    values: {},
    set: function (obj, prop, valeur) {
        if (obj[prop] !== valeur) {
            this.values[prop] = valeur;
            this.saveQuery = { $set: { [prop]: valeur } }
        }
    },
    get: function (obj, prop) {
        return this.values[prop] ?? obj[prop]
    }
}
const mongooseDocument = new Proxy(dbDocument, extend)
console.log(mongooseDocument.firstname) // John
mongooseDocument.firstname = 'Jane'
console.log(extend.saveQuery) // { '$set': { firstname: 'Jane' } }
console.log(mongooseDocument.firstname) // Jane