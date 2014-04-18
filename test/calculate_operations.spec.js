// Calculates the differences into a list of edit operations.
describe('calculate_operations', function(){
  var cut, res;

  beforeEach(function(){
    cut = require('../js/htmldiff').calculate_operations;
  });

  it('should be a function', function(){
    expect(cut).is.a('function');
  });

  describe('Actions', function(){
    describe('In the middle', function(){
      describe('Replace', function(){
        beforeEach(function(){
          var before = 'working on it'.split(' ');
          var after = 'working in it'.split(' ');
          res = cut(before, after);
        });

        it('should result in 3 operations', function(){
          expect(res.length).to.equal(3);
        });

        it('should replace "on"', function(){
          expect(res[1]).eql({
            action         : 'replace',
            start_in_before: 1,
            end_in_before  : 1,
            start_in_after : 1,
            end_in_after   : 1
          });
        });
      }); // describe('Replace')

      describe('Insert', function(){
        beforeEach(function(){
          var before = 'working it'.split(' ');
          var after = 'working on it'.split(' ');
          res = cut(before, after);
        });

        it('should result in 3 operations', function(){
          expect(res.length).to.equal(3);
        });

        it('should show an insert for "on"', function(){
          expect(res[1]).eql({
            action         : 'insert',
            start_in_before: 1,
            end_in_before  : undefined,
            start_in_after : 1,
            end_in_after   : 1
          });
        });

        describe('More than one word', function(){
          beforeEach(function(){
            var before = 'working it'.split(' ');
            var after = 'working all up on it'.split(' ');
            res = cut(before, after);
          });

          it('should still have 3 operations', function(){
            expect(res.length).to.equal(3);
          });

          it('should show a big insert', function(){
            expect(res[1]).eql({
              action         : 'insert',
              start_in_before: 1,
              end_in_before  : undefined,
              start_in_after : 1,
              end_in_after   : 3
            });
          });
        }); // describe('More than one word')
      }); // describe('Insert')

      describe('Delete', function(){
        beforeEach(function(){
          var before = 'this is a lot of text'.split(' ');
          var after = 'this is text'.split(' ');
          res = cut(before, after);
        });

        it('should return 3 operations', function(){
          expect(res.length).to.equal(3);
        });

        it('should show the delete in the middle', function(){
          expect(res[1]).eql({
            action: 'delete',
            start_in_before: 2,
            end_in_before: 4,
            start_in_after: 2,
            end_in_after: undefined
          });
        });
      }); // describe('Delete')

      describe('Equal', function(){
        beforeEach(function(){
          var before = 'this is what it sounds like'.split(' ');
          var after = 'this is what it sounds like'.split(' ');
          res = cut(before, after);
        });

        it('should return a single op', function(){
          expect(res.length).to.equal(1);
          expect(res[0]).eql({
            action: 'equal',
            start_in_before: 0,
            end_in_before: 5,
            start_in_after: 0,
            end_in_after: 5
          });
        });
      }); // describe('Equal')
    }); // describe('In the middle')

    describe('At the beginning', function(){
      describe('Replace', function(){
        beforeEach(function(){
          var before = 'I dont like veggies'.split(' ');
          var after = 'Joe loves veggies'.split(' ');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a replace at the beginning', function(){
          expect(res[0]).eql({
            action         : 'replace',
            start_in_before: 0,
            end_in_before  : 2,
            start_in_after : 0,
            end_in_after   : 1
          });
        });
      }); // describe('Replace')

      describe('Insert', function(){
        beforeEach(function(){
          var before = 'dog'.split(' ');
          var after = 'the shaggy dog'.split(' ');
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
            end_in_after   : 1
          });
        });
      }); // describe('Insert')

      describe('Delete', function(){
        beforeEach(function(){
          var before = 'awesome dog barks'.split(' ');
          var after = 'dog barks'.split(' ');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a delete at the beginning', function(){
          expect(res[0]).eql({
            action         : 'delete',
            start_in_before: 0,
            end_in_before  : 0,
            start_in_after : 0,
            end_in_after   : undefined
          });
        });
      }); // describe('Delete')
    }); // describe('At the beginning')

    describe('At the end', function(){
      describe('Replace', function(){
        beforeEach(function(){
          var before = 'the dog bit the cat'.split(' ');
          var after = 'the dog bit a bird'.split(' ');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a replace at the end', function(){
          expect(res[1]).eql({
            action         : 'replace',
            start_in_before: 3,
            end_in_before  : 4,
            start_in_after : 3,
            end_in_after   : 4
          });
        });
      }); // describe('Replace')

      describe('Insert', function(){
        beforeEach(function(){
          var before = 'this is a dog'.split(' ');
          var after = 'this is a dog that barks'.split(' ');
          res = cut(before, after);
        });

        it('should return 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have an Insert at the end', function(){
          expect(res[1]).eql({
            action         : 'insert',
            start_in_before: 4,
            end_in_before  : undefined,
            start_in_after : 4,
            end_in_after   : 5
          });
        });
      }); // describe('Insert')

      describe('Delete', function(){
        beforeEach(function(){
          var before = 'this is a dog that barks'.split(' ');
          var after = 'this is a dog'.split(' ');
          res = cut(before, after);
        });

        it('should have 2 operations', function(){
          expect(res.length).to.equal(2);
        });

        it('should have a delete at the end', function(){
          expect(res[1]).eql({
            action         : 'delete',
            start_in_before: 4,
            end_in_before  : 5,
            start_in_after : 4,
            end_in_after   : undefined
          });
        });
      }); // describe('Delete')
    }); // describe('At the end')
  }); // describe('Actions')

  describe('Action Combination', function(){
    describe('Absorb single-whitespace to make contiguous replace actions', function(){
      beforeEach(function(){
        // There are a bunch of replaces, but, because whitespace is
        // tokenized, they are broken up with equals. We want to combine
        // them into a contiguous replace operation.
        var before = ['I', ' ', 'am', ' ', 'awesome'];
        var after = ['You', ' ', 'are', ' ', 'great'];
        res = cut(before, after);
      });

      it('should return 1 action', function(){
        expect(res.length).to.equal(1);
      });

      it('should return the correct replace action', function(){
        expect(res[0]).eql({
          action: 'replace',
          start_in_before: 0,
          end_in_before: 4,
          start_in_after: 0,
          end_in_after: 4
        });
      });

      describe('but dont absorb non-single-whitespace tokens', function(){
        beforeEach(function(){
          var before = ['I', '  ', 'am', ' ', 'awesome'];
          var after = ['You', '  ', 'are', ' ', 'great'];
          res = cut(before, after);
        });

        it('should return 3 actions', function(){
          expect(res.length).to.equal(3);
        });

        it('should have a replace first', function(){
          expect(res[0].action).to.equal('replace');
        });

        it('should have an equal second', function(){
          expect(res[1].action).to.equal('equal');
        });

        it('should have a replace last', function(){
          expect(res[2].action).to.equal('replace');
        });
      }); // describe('but dont absorb non-single-whitespace tokens')
    }); // describe('Absorb single-whitespace to make contiguous replace actions')
  }); // describe('Action Combination')
}); // describe('calculate_operations')
