describe('render_operations', function(){
  var cut, res;

  beforeEach(function(){
    var diff = require('../js/htmldiff');
    cut = function(before, after){
      var ops = diff.calculate_operations(before, after);
      return diff.render_operations(before, after, ops);
    };
  });

  it('should be a function', function(){
    expect(cut).is.a('function');
  });

  describe('equal', function(){
    beforeEach(function(){
      var before = ['this', ' ', 'is', ' ', 'a', ' ', 'test'];
      res = cut(before, before);
    });

    it('should output the text', function(){
      expect(res).equal('this is a test');
    });
  }); // describe('equal')

  describe('insert', function(){
    beforeEach(function(){
      before = ['this', ' ', 'is'];
      after = ['this', ' ', 'is', ' ', 'a', ' ', 'test'];
      res = cut(before, after);
    });

    it('should wrap in an <ins>', function(){
      expect(res).equal('this is<ins> a test</ins>');
    });
  }); // describe('insert')


  describe('delete', function(){
    beforeEach(function(){
      var before = ['this', ' ', 'is', ' ', 'a', ' ', 'test',
        ' ', 'of', ' ', 'stuff'];
      var after = ['this', ' ', 'is', ' ', 'a', ' ', 'test'];
      res = cut(before, after);
    });

    it('should wrap in a <del>', function(){
      expect(res).to.equal('this is a test<del> of stuff</del>');
    });
  }); // describe('delete')


  describe('replace', function(){
    beforeEach(function(){
      var before = ['this', ' ', 'is', ' ', 'a', ' ', 'break'];
      var after = ['this', ' ', 'is', ' ', 'a', ' ', 'test'];
      res = cut(before, after);
    });

    it('should wrap in both <ins> and <del>', function(){
      expect(res).to.equal('this is a <del>break</del><ins>test</ins>');
    });
  }); // describe('replace')

  describe('Dealing with tags', function(){
    beforeEach(function(){
      var before = ['<p>', 'a', '</p>'];
      var after = ['<p>', 'a', ' ', 'b', '</p>', '<p>', 'c', '</p>'];
      res = cut(before, after);
    });

    it('should make sure the <ins/del> tags are within the <p> tags', function(){
      expect(res).to.equal('<p>a<ins> b</ins></p><p><ins>c</ins></p>');
    });

    describe('When there is a change at the beginning, in a <p>', function(){
      beforeEach(function(){
        var before = ['<p>', 'this', ' ', 'is', ' ', 'awesome', '</p>'];
        var after = ['<p>', 'I', ' ', 'is', ' ', 'awesome', '</p>'];
        res = cut(before, after);
      });

      it('should keep the change inside the <p>', function(){
        expect(res).to.equal('<p><del>this</del><ins>I</ins> is awesome</p>');
      });
    }); // describe('When there is a change at the beginning, in a <p>')
  }); // describe('Dealing with tags')

  describe('empty tokens', function(){
    it('should not be wrapped', function(){
      var before = ['text'];
      var after = ['text', ' '];

      res = cut(before, after);

      expect(res).to.equal('text');
    });
  }); // describe('empty tokens')

  describe('tags with attributes', function(){
    it('should treat attribute changes as equal and output the after tag', function(){
      var before = ['<p>', 'this', ' ', 'is', ' ', 'awesome', '</p>'];
      var after = ['<p style="margin: 2px;" class="after">', 'this', ' ', 'is', ' ', 'awesome', '</p>'];

      res = cut(before, after);

      expect(res).to.equal('<p style="margin: 2px;" class="after">this is awesome</p>');
    });

    it('should show changes within tags with different attributes', function(){
      var before = ['<p>', 'this', ' ', 'is', ' ', 'awesome', '</p>'];
      var after = ['<p style="margin: 2px;" class="after">', 'that', ' ', 'is', ' ', 'awesome', '</p>'];

      res = cut(before, after);

      expect(res).to.equal(
        '<p style="margin: 2px;" class="after"><del>this</del><ins>that</ins> is awesome</p>');
    });
  }); // describe('tags with attributes')

  describe('wrappable tags', function(){
    it('should wrap void tags', function(){
      var before = ['old', ' ', 'text'];
      var after = ['new', '<br/>', ' ', 'text'];

      res = cut(before, after);

      expect(res).to.equal('<del>old</del><ins>new<br/></ins> text');
    });

    it('should wrap atomic tags', function(){
      var before = ['old', '<iframe src="source.html"></iframe>', ' ', 'text'];
      var after = ['new', ' ', 'text'];

      res = cut(before, after);

      expect(res).to.equal('<del>old<iframe src="source.html"></iframe></del><ins>new</ins> text');
    });
  }); // describe('tags with attributes')
}); // describe('render_operations')
