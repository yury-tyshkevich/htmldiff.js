describe 'The module', ->
  beforeEach ->
    @cut = require '../js/htmldiff'

  it 'should return a function', ->
    (expect @cut).is.a 'function'
