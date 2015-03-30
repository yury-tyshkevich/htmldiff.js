describe('find_matching_blocks', function(){
  var diff, cut, res, create_token, tokenize, create_segment, html_to_tokens;

  beforeEach(function(){
    diff = require('../js/htmldiff');
    create_segment = diff.find_matching_blocks.create_segment;
    html_to_tokens = diff.html_to_tokens;
    create_token = diff.find_matching_blocks.create_token;
    tokenize = function(tokens) {
      return tokens.map(function(token) {
        return create_token(token);
      });
    };
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
        res = cut(tokenize(['a', 'apple', 'has', 'a', 'worm']));
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
      cut = diff.find_matching_blocks.find_best_match;
      invoke = function(before, after){
        var segment = create_segment(before, after, 0, 0);

        res = cut(segment);
      };
    });

    describe('When there is a match', function(){
      beforeEach(function(){
        var before = tokenize(['a', 'dog', 'bites']);
        var after = tokenize(['a', 'dog', 'bites', 'a', 'man']);
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
          before = tokenize(['dog', 'bites']);
          after = tokenize(['the', 'dog', 'bites', 'a', 'man']);
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

    describe('When there is no match', function(){
      beforeEach(function(){
        var before = tokenize(['the', 'rat', 'sqeaks']);
        var after = tokenize(['a', 'dog', 'bites', 'a', 'man']);
        invoke(before, after);
      });

      it('should return nothing', function(){
        expect(res).to.exist;
        expect(res.length).to.equal(0);
      });
    }); // describe('When these is no match')
  }); // describe('find_match')

  describe('find_matching_blocks', function(){
    var segment;

    beforeEach(function(){
      cut = diff.find_matching_blocks;
    });

    it('should be a function', function(){
      expect(cut).is.a('function');
    });

    describe('When called with a single match', function(){
      beforeEach(function(){
        var before = html_to_tokens('a dog bites');
        var after = html_to_tokens('when a dog bites it hurts');
        segment = create_segment(before, after, 0, 0);

        res = cut(segment);
      });

      it('should return a match', function(){
        expect(res.length).to.equal(1);
      });
    }); // describe('When called with a single match')

    describe('When called with multiple matches', function(){
      beforeEach(function(){
        var before = html_to_tokens('the dog bit a man');
        var after = html_to_tokens('the large brown dog bit a tall man');
        segment = create_segment(before, after, 0, 0);
        res = cut(segment);
      });

      it('should return 3 matches', function(){
        expect(res.length).to.equal(3);
      });

      it('should match "the"', function(){
        expect(res[0].start_in_before).eql(0);
        expect(res[0].start_in_after).eql(0);
        expect(res[0].end_in_before).eql(0);
        expect(res[0].end_in_after).eql(0);
        expect(res[0].length).eql(1);
      });

      it('should match "dog bit a"', function(){
        expect(res[1].start_in_before).eql(1);
        expect(res[1].start_in_after).eql(5);
        expect(res[1].end_in_before).eql(7);
        expect(res[1].end_in_after).eql(11);
        expect(res[1].length).eql(7);
      });

      it('should match "man"', function(){
        expect(res[2].start_in_before).eql(8);
        expect(res[2].start_in_after).eql(14);
        expect(res[2].end_in_before).eql(8);
        expect(res[2].end_in_after).eql(14);
        expect(res[2].length).eql(1);
      });
    }); // describe('When called with multiple matches')
  }); // describe('find_matching_blocks')
}); // describe('find_matching_blocks')
