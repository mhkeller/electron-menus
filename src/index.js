var path = require('path')
var fs = require('fs')
var cheerio = require('cheerio')
var _ = require('underscore')

var here = path.resolve(__dirname, '../')

var menus_template = readFileSync(path.join(here, 'menus/menus.jst'))
var menus_script = readFileSync(path.join(here, 'menus/default.js'))
var menus_markup

var settings = {
  id: 'ELECTRON-menus',
  replace: false
}

function fillTemplate () {
  menus_markup = menus_template.replace('{{id}}', settings.id)
                               .replace('{{template}}', menus_script)
}

function readFileSync (filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function prep (menuArray, opts) {
  opts = opts || {}
  // Replace our defaults with these if any
  _.extend(settings, opts)

  if (menuArray) {
    if (_.isArray(menuArray)) {
      menuArray = JSON.stringify(menuArray)
    }
    menus_script = menuArray
  }

  fillTemplate()
}

function injectInto (moduleIndexPath, menuArray, opts) {
  if (_.isObject(menuArray)) {
    opts = _.clone(menuArray)
    menuArray = null
  }
  // If they passed it in with `file://` at the beginning, remove
  moduleIndexPath = moduleIndexPath.replace(/^file:\/\//, '')
  // Add our settings, if they exist, and create the text we will inject into the target script
  prep(menuArray, opts)

  var index_text = readFileSync(moduleIndexPath)
  var $ = cheerio.load(index_text)

  // Add menu scripts
  var $body = $('body')
  var $existing_script = $body.find('script#' + settings.id)
  var has_menus = $existing_script.length > 0

  if (has_menus && settings.replace) {
    $existing_script.remove()
  }

  if (!has_menus || settings.replace) {
    $body.append(menus_markup)
    // Rewrite `index.html`
    fs.writeFileSync(moduleIndexPath, $.html())
  }

  return this

}

module.exports = { // eslint-disable-line accessor-pairs
	set: injectInto
}
