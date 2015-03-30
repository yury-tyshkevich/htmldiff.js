describe('html_to_tokens', function(){
  var cut, res, diff, create_token, tokenize;

  beforeEach(function(){
    diff = require('../js/htmldiff')
    cut = diff.html_to_tokens;

    create_token = diff.find_matching_blocks.create_token;
    tokenize = function(tokens) {
      return tokens.map(function(token) {
        return create_token(token);
      });
    };
  });

  it('should be a function', function(){
    expect(cut).is.a('function');
  });

  describe('when called with text', function(){
    beforeEach(function(){
      res = cut('this is a test');
    });

    it('should return 4', function(){
      expect(res.length).to.equal(7);
    });
  }); // describe('when called with text')

  describe('when called with html', function(){
    beforeEach(function(){
      res = cut('<p>this is a <strong>test</strong></p>');
    });

    it('should return 11', function(){
      expect(res.length).to.equal(11);
    });
  }); // describe('when called with html')

  it('should identify contiguous whitespace as a single token', function(){
    expect(cut('a   b')).to.eql(tokenize(['a', '   ', 'b']));
  });

  it('should identify a single space as a single token', function(){
    expect(cut(' a b ')).to.eql(tokenize([' ', 'a', ' ', 'b', ' ']));
  });

  it('should identify self closing tags as tokens', function(){
    expect(cut('<p>hello</br>goodbye</p>'))
    .eql(tokenize(['<p>', 'hello', '</br>', 'goodbye', '</p>']));
  });

  describe('when encountering atomic tags', function(){
    it('should identify an image tag as a single token', function(){
      expect(cut('<p><img src="1.jpg"><img src="2.jpg"></p>'))
      .eql(tokenize(['<p>', '<img src="1.jpg">', '<img src="2.jpg">', '</p>']));
    });

    it('should identify an iframe tag as a single token', function(){
      expect(cut('<p><iframe src="sample.html"></iframe></p>'))
      .eql(tokenize(['<p>', '<iframe src="sample.html"></iframe>', '</p>']));
    });

    it('should identify an object tag as a single token', function(){
      expect(cut('<p><object><param name="1" /><param name="2" /></object></p>'))
      .eql(tokenize(['<p>', '<object><param name="1" /><param name="2" /></object>', '</p>']));
    });

    it('should identify a math tag as a single token', function(){
      expect(cut('<p><math xmlns="http://www.w3.org/1998/Math/MathML">' +
        '<mi>&#x03C0;<!-- π --></mi>' +
        '<mo>&#x2062;<!-- &InvisibleTimes; --></mo>' +
        '<msup><mi>r</mi><mn>2</mn></msup></math></p>'))
      .eql(tokenize([
        '<p>',
        '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
            '<mi>&#x03C0;<!-- π --></mi>' +
            '<mo>&#x2062;<!-- &InvisibleTimes; --></mo>' +
            '<msup><mi>r</mi><mn>2</mn></msup></math>',
        '</p>']));
    });

    it('should identify an svg tag as a single token', function(){
      expect(cut('<p><svg width="100" height="100">' +
        '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
        '</svg></p>'))
      .eql(tokenize([
        '<p>',
        '<svg width="100" height="100">' +
          '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
          '</svg>',
        '</p>']));
    });

    it('should identify a script tag as a single token', function(){
      expect(cut('<p><script>console.log("hi");</script></p>'))
      .eql(tokenize(['<p>', '<script>console.log("hi");</script>', '</p>']));
    });
  }); // describe('when encountering atomic tags')
}); // describe('html_to_tokens')
