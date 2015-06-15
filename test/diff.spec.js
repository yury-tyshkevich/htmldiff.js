describe('Diff', function(){
    var cut, res;

    beforeEach(function(){
        cut = require('../js/htmldiff');
    });

    describe('When both inputs are the same', function(){
        beforeEach(function(){
            res = cut('input text', 'input text');
        });

        it('should return the text', function(){
            expect(res).equal('input text');
        });
    });

    describe('When a letter is added', function(){
        beforeEach(function(){
            res = cut('input', 'input 2');
        });

        it('should mark the new letter', function(){
            expect(res).to.equal('input<ins data-operation-index="1"> 2</ins>');
        });
    });

    describe('Whitespace differences', function(){
        it('should collapse adjacent whitespace', function(){
            expect(cut('Much \n\t    spaces', 'Much spaces')).to.equal('Much spaces');
        });

        it('should consider non-breaking spaces equal', function(){
            expect(cut('Hello&nbsp;world', 'Hello&#160;world')).to.equal('Hello&#160;world');
        });

        it('should consider non-breaking spaces and non-adjacent regular spaces equal', function(){
            expect(cut('Hello&nbsp;world', 'Hello world')).to.equal('Hello world');
        });
    });

    describe('When a class name is specified', function(){
        it('should include the class in the wrapper tags', function(){
            expect(cut('input', 'input 2', 'diff-result')).to.equal(
                    'input<ins data-operation-index="1" class="diff-result"> 2</ins>');
        });
    });

    describe('When a data prefix is specified', function(){
        it('should include the data prefix in data attributes', function(){
            expect(cut('input', 'input <b>2</b>', 'diff-result', 'prefix')).to.equal(
                    'input<b data-diff-node="ins" data-prefix-operation-index="1">' +
                    '<ins data-prefix-operation-index="1" class="diff-result">2</ins></b>');
        });
    });
});
