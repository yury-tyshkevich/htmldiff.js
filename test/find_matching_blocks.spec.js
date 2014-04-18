describe('find_matching_blocks', function(){
  var diff, cut, res;

  beforeEach(function(){
    diff = require('../js/htmldiff');
  });

  describe('index_tokens', function(){
    beforeEach(function(){
      cut = diff.find_matching_blocks.create_index;
    });

    it('should be a function', function(){
      expect(cut).is.a('function');
    });

    describe('When the items exist in the search target', function(){
      beforeEach(function(){
        res = cut({
          find_these: ['a', 'has'],
          in_these: ['a', 'apple', 'has', 'a', 'worm']
        });
      });

      it('should find "a" twice', function(){
        expect(res['a'].length).to.equal(2);
      });

      it('should find "a" at 0', function(){
        expect(res['a'][0]).to.equal(0);
      });

      it('should find "a" at 3', function(){
        expect(res['a'][1]).to.equal(3);
      });

      it('should find "has" at 2', function(){
        expect(res['has'][0]).to.equal(2);
      });
    }); // describe('When the items exist in the search target')
  }); // describe('index_tokens')

  describe('find_match', function(){
    var invoke;

    beforeEach(function(){
      cut = diff.find_matching_blocks.find_match;
      invoke = function(before, after){
        var index = diff.find_matching_blocks.create_index({
          find_these: before,
          in_these: after
        });

        res = cut(before, after, index, 0, before.length, 0, after.length);
      };
    });

    describe('When there is a match', function(){
      beforeEach(function(){
        var before = ['a', 'dog', 'bites'];
        var after = ['a', 'dog', 'bites', 'a', 'man'];
        invoke(before, after);
      });

      it('should match the match', function(){
        expect(res).to.exist;
        expect(res.start_in_before).equal(0);
        expect(res.start_in_after).equal(0);
        expect(res.length).equal(3);
        expect(res.end_in_before).equal(2);
        expect(res.end_in_after).equal(2);
      });

      describe('When the match is surrounded', function(){
        beforeEach(function(){
          before = ['dog', 'bites']
          after = ['the', 'dog', 'bites', 'a', 'man']
          invoke(before, after);
        });

        it('should match with appropriate indexing', function(){
          expect(res).to.exist;
          expect(res.start_in_before).to.equal(0);
          expect(res.start_in_after).to.equal(1);
          expect(res.end_in_before).to.equal(1);
          expect(res.end_in_after).to.equal(2);
        });
      }); // describe('When the match is surrounded')
    }); // describe('When there is a match')

    describe('When these is no match', function(){
      beforeEach(function(){
        var before = ['the', 'rat', 'sqeaks'];
        var after = ['a', 'dog', 'bites', 'a', 'man'];
        invoke(before, after);
      });

      it('should return nothing', function(){
        expect(res).to.not.exist;
      });
    }); // describe('When these is no match')
  }); // describe('find_match')

  describe('find_matching_blocks', function(){
    beforeEach(function(){
      cut = diff.find_matching_blocks;
    });

    it('should be a function', function(){
      expect(cut).is.a('function');
    });

    describe('When called with a single match', function(){
      beforeEach(function(){
        var before = 'a dog bites'.split(' ');
        var after = 'when a dog bites it hurts'.split(' ');
        res = cut(before, after);
      });

      it('should return a match', function(){
        expect(res.length).to.equal(1);
      });
    }); // describe('When called with a single match')

    describe('When called with multiple matches', function(){
      beforeEach(function(){
        before = 'the dog bit a man'.split(' ');
        after = 'the large brown dog bit a tall man'.split(' ');
        res = cut(before, after);
      });

      it('should return 3 matches', function(){
        expect(res.length).to.equal(3);
      });

      it('should match "the"', function(){
        expect(res[0]).eql({
          start_in_before: 0,
          start_in_after: 0,
          end_in_before: 0,
          end_in_after: 0,
          length: 1
        });
      });

      it('should match "dog bit a"', function(){
        expect(res[1]).eql({
          start_in_before: 1,
          start_in_after: 3,
          end_in_before: 3,
          end_in_after: 5,
          length: 3
        });
      });

      it('should match "man"', function(){
        expect(res[2]).eql({
          start_in_before: 4,
          start_in_after: 7,
          end_in_before: 4,
          end_in_after: 7,
          length: 1
        });
      });
    }); // describe('When called with multiple matches')
  }); // describe('find_matching_blocks')
}); // describe('find_matching_blocks')
