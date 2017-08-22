const immutable = require('immutable')
const osmosis   = require('osmosis')

const {extract, extractLink} = require('./extract')

function farnell(results) {
  const completed = results.map((result, query) => {
    let promise
    if (immutable.List.isList(result)) {
      promise = Promise.all(result.map(_farnell)).then(r => {
        return immutable.List(r)
      })
    } else {
      promise = _farnell(result)
    }
    return promise.then(r => [query, r])
  })
  return Promise.all(completed.values()).then(immutable.Map)
}

function _farnell(part) {
    const offers =  part.get('offers')
    if (offers == null) {
      return Promise.resolve(part)
    }
    const farnell_offers = offers.filter(offer => {
      return offer.get('sku').get('vendor') === 'Farnell'
    })
    const queries = farnell_offers.map(offer => {
      return runQuery(offer.get('sku').get('part'))
        .then(farnell_info => offer.merge(farnell_info))
        .catch(e => {
          console.error(e)
          return offer
        })
    })
    return Promise.all(queries).then(completed_offers => {
      const not_farnell_offers = offers.filter(offer => {
        return offer.get('sku').get('vendor') !== 'Farnell'
      })
      return part.set('offers', not_farnell_offers.concat(completed_offers))
    })
}

function runQuery(sku) {
  return new Promise((resolve, reject) => {
    const url = `http://uk.farnell.com/${sku}`
    osmosis.get(url)
      .set({
        url         : '#productMainImage @src',
        names       : ['dt[id^=descAttributeName]'],
        values      : ['dd[id^=descAttributeValue]'],
        description : "[itemprop='name']",
      })
      .data(({url, names, values, description}) => {
        resolve(immutable.Map({
          image: immutable.Map({
            url,
            credit_string : 'Farnell',
            credit_url    : 'http://uk.farnell.com',
          }),
          description,
          specs: immutable.List(names).zip(values)
            .map(([name, value]) => immutable.Map({name, value})),
        }))
      })
  })
}

module.exports = farnell
