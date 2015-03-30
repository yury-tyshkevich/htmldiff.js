// Calculates the differences into a list of edit operations.
describe('calculate_operations', function(){
  var cut, res, tokenize;

  beforeEach(function(){
    cut = require('../js/htmldiff').calculate_operations;
    tokenize = require('../js/htmldiff').html_to_tokens;
  });

  it('should be a function', function(){
    expect(cut).is.a('function');
  });

  describe('Actions', function(){
    describe('In the middle', function(){
      describe('Replace', function(){
        beforeEach(function(){
          var before = tokenize('working on it');
          var after = tokenize('working in it');
          res = cut(before, after);
        });

        it('should result in 3 operations', function(){
          expect(res.length).to.equal(3);
        });

        it('should replace "on"', function(){
          expect(res[1]).eql({
            action         : 'replace',
            start_in_before: 2,
            end_in_before  : 2,
            start_in_after : 2,
            end_in_after   : 2
          });
        });
      }); // describe('Replace')

      describe('Insert', function(){
        beforeEach(function(){
          var before = tokenize('working it');
          var after = tokenize('working in it');
          res = cut(before, after);
        });

        it('should result in 3 operations', function(){
          expect(res.length).to.equal(3);
        });

        it('should show an insert for "on"', function(){
          expect(res[1]).eql({
            action         : 'insert',
            start_in_before: 2,
            end_in_before  : undefined,
            start_in_after : 2,
            end_in_after   : 3
          });
        });

        describe('More than one word', function(){
          beforeEach(function(){
            var before = tokenize('working it');
            var after =  tokenize('working all up on it');
            res = cut(before, after);
          });

          it('should still have 3 operations', function(){
            expect(res.length).to.equal(3);
          });

          it('should show a big insert', function(){
            expect(res[1]).eql({
              action         : 'insert',
              start_in_before: 2,
              end_in_before  : undefined,
              start_in_after : 2,
              end_in_after   : 7
            });
          });
        }); // describe('More than one word')
      }); // describe('Insert')

      describe('Delete', function(){
        beforeEach(function(){
          var before = tokenize('this is a lot of text');
          var after = tokenize('this is text');
          res = cut(before, after);
        });

        it('should return 3 operations', function(){
          expect(res.length).to.equal(3);
        });

        it('should show the delete in the middle', function(){
          expect(res[1]).eql({
            action: 'delete',
            start_in_before: 4,
            end_in_before: 9,
            start_in_after: 4,
            end_in_after: undefined
          });
        });
      }); // describe('Delete')

      describe('Equal', function(){
        beforeEach(function(){
          var before = tokenize('this is what it sounds like');
          var after = tokenize('this is what it sounds like');
          res = cut(before, after);
        });

        it('should return a single op', function(){
          expect(res.length).to.equal(1);
          expect(res[0]).eql({
            action: 'equal',
            start_in_before: 0,
            end_in_before: 10,
            start_in_after: 0,
            end_in_after: 10
          });
        });
      }); // describe('Equal')
    }); // describe('In the middle')

    describe('At the beginning', function(){
      describe('Replace', function(){
        beforeEach(function(){
          var before = tokenize('I dont like veggies');
          var after = tokenize('Joe loves veggies');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a replace at the beginning', function(){
          expect(res[0]).eql({
            action         : 'replace',
            start_in_before: 0,
            end_in_before  : 4,
            start_in_after : 0,
            end_in_after   : 2
          });
        });
      }); // describe('Replace')

      describe('Insert', function(){
        beforeEach(function(){
          var before = tokenize('dog');
          var after = tokenize('the shaggy dog');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have an insert at the beginning', function(){
          expect(res[0]).eql({
            action         : 'insert',
            start_in_before: 0,
            end_in_before  : undefined,
            start_in_after : 0,
            end_in_after   : 3
          });
        });
      }); // describe('Insert')

      describe('Delete', function(){
        beforeEach(function(){
          var before = tokenize('awesome dog barks');
          var after = tokenize('dog barks');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a delete at the beginning', function(){
          expect(res[0]).eql({
            action         : 'delete',
            start_in_before: 0,
            end_in_before  : 1,
            start_in_after : 0,
            end_in_after   : undefined
          });
        });
      }); // describe('Delete')
    }); // describe('At the beginning')

    describe('At the end', function(){
      describe('Replace', function(){
        beforeEach(function(){
          var before = tokenize('the dog bit the cat');
          var after = tokenize('the dog bit a bird');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a replace at the end', function(){
          expect(res[1]).eql({
            action         : 'replace',
            start_in_before: 6,
            end_in_before  : 8,
            start_in_after : 6,
            end_in_after   : 8
          });
        });
      }); // describe('Replace')

      describe('Insert', function(){
        beforeEach(function(){
          var before = tokenize('this is a dog');
          var after = tokenize('this is a dog that barks');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have an Insert at the end', function(){
          expect(res[1]).eql({
            action         : 'insert',
            start_in_before: 7,
            end_in_before  : undefined,
            start_in_after : 7,
            end_in_after   : 10
          });
        });
      }); // describe('Insert')

      describe('Delete', function(){
        beforeEach(function(){
          var before = tokenize('this is a dog that barks');
          var after = tokenize('this is a dog');
          res = cut(before, after);
        });

        it('should have 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a delete at the end', function(){
          expect(res[1]).eql({
            action         : 'delete',
            start_in_before: 7,
            end_in_before  : 10,
            start_in_after : 7,
            end_in_after   : undefined
          });
        });
      }); // describe('Delete')
    }); // describe('At the end')
  }); // describe('Actions')

  describe('Action Combination', function(){
    describe('dont absorb non-single-whitespace tokens', function(){
      beforeEach(function(){
        var before = tokenize('I  am awesome');
        var after = tokenize('You  are great');
        res = cut(before, after);
      });

      it('should return 3 actions', function(){
        expect(res.length).to.equal(1);
      });

      it('should have a replace first', function(){
        expect(res[0].action).to.equal('replace');
      });
    }); // describe('dont absorb non-single-whitespace tokens')
  }); // describe('Action Combination')
}); // describe('calculate_operations')
