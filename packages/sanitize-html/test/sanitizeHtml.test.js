// ***************************************************************
// This package is a copy of sanitize-html taken at
// version 1.27.2 https://github.com/apostrophecms/sanitize-html
//
// The package was copied here because the sanitizeHtml function below
// internally defines an escapeHtml function. The escapeHtml function
// escaped characters such as < > & which is unwanted behavior.
//
// This copied version of sanitize-html has been modified to remove
// the escapeHtml logic and simply return the first argument it's called with.
// ***************************************************************

var assert = require('assert');
var sinon = require('sinon');
var sanitizeHtml = require('../src/');

describe('sanitizeHtml', function () {
    it('should pass through simple well-formed whitelisted markup', function () {
        assert.equal(
            sanitizeHtml('<div><p>Hello <b>the&lt;re</b></p></div>'),
            '<div><p>Hello <b>the&lt;re</b></p></div>',
        );
    });
    // prettier-ignore
    it('should pass through !`¬£$%^&*()_-+=[]{};:\'@\'~#,.<>?\\/', function() {
        assert.equal(
            sanitizeHtml('!`¬£$%^&*()_-+=[]{};:\'@\'~#,.<>?\\/'),
            '!`¬£$%^&*()_-+=[]{};:\'@\'~#,.<>?\\/'
        );
    });
    it('should pass through another simple well-formed whitelisted markup', function () {
        assert.equal(
            sanitizeHtml('<div><p>Hello <b>there</b></p></div>some other > thing & this thing'),
            '<div><p>Hello <b>there</b></p></div>some other > thing & this thing',
        );
    });

    it('should pass through yet another simple well-formed whitelisted markup', function () {
        assert.equal(
            sanitizeHtml('<div><p>Hello <b>there</b></p></div>some other &lt; thing'),
            '<div><p>Hello <b>there</b></p></div>some other &lt; thing',
        );
    });
    it('should not pass through any text outside html tag boundary since html tag is found and option is ON', function () {
        assert.equal(
            sanitizeHtml(
                'Text before html tag<html><div><p>Hello <b>there</b></p></div></html>Text after html tag!P�X��[<p>paragraph after closing html</p>',
                {
                    enforceHtmlBoundary: true,
                },
            ),
            '<div><p>Hello <b>there</b></p></div>',
        );
    });
    it('should pass through text outside html tag boundary since option is OFF', function () {
        assert.equal(
            sanitizeHtml(
                'Text before html tag<html><div><p>Hello <b>there</b></p></div></html>Text after html tag!P�X��[<p>paragraph after closing html</p>',
                {
                    enforceHtmlBoundary: false,
                },
            ),
            'Text before html tag<div><p>Hello <b>there</b></p></div>Text after html tag!P�X��[<p>paragraph after closing html</p>',
        );
    });
    it('should pass through text outside html tag boundary since option is ON but html tag is not found', function () {
        assert.equal(
            sanitizeHtml(
                'Text before div tag<div><p>Hello <b>there</b></p></div>Text after div tag!P�X��[<p>paragraph after closing div</p>',
                {
                    enforceHtmlBoundary: true,
                },
            ),
            'Text before div tag<div><p>Hello <b>there</b></p></div>Text after div tag!P�X��[<p>paragraph after closing div</p>',
        );
    });
    it('should pass through all markup if allowedTags and allowedAttributes are set to false', function () {
        assert.equal(
            sanitizeHtml('<div><wiggly worms="ewww">hello</wiggly></div>', {
                allowedTags: false,
                allowedAttributes: false,
            }),
            '<div><wiggly worms="ewww">hello</wiggly></div>',
        );
    });
    it('should respect text nodes at top level', function () {
        assert.equal(sanitizeHtml('Blah blah blah<p>Whee!</p>'), 'Blah blah blah<p>Whee!</p>');
    });
    it('should reject markup not whitelisted without destroying its text', function () {
        assert.equal(sanitizeHtml('<div><wiggly>Hello</wiggly></div>'), '<div>Hello</div>');
    });
    it('should accept a custom list of allowed tags', function () {
        assert.equal(
            sanitizeHtml('<blue><red><green>Cheese</green></red></blue>', {
                allowedTags: ['blue', 'green'],
            }),
            '<blue><green>Cheese</green></blue>',
        );
    });
    it('should reject attributes not whitelisted', function () {
        assert.equal(sanitizeHtml('<a href="foo.html" whizbang="whangle">foo</a>'), '<a href="foo.html">foo</a>');
    });
    it('should accept a custom list of allowed attributes per element', function () {
        assert.equal(
            sanitizeHtml('<a href="foo.html" whizbang="whangle">foo</a>', {
                allowedAttributes: { a: ['href', 'whizbang'] },
            }),
            '<a href="foo.html" whizbang="whangle">foo</a>',
        );
    });
    it('should clean up unclosed img tags and p tags', function () {
        assert.equal(
            sanitizeHtml('<img src="foo.jpg"><p>Whee<p>Again<p>Wow<b>cool</b>', {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
            '<img src="foo.jpg" /><p>Whee</p><p>Again</p><p>Wow<b>cool</b></p>',
        );
    });
    it('should reject hrefs that are not relative, ftp, http, https or mailto', function () {
        assert.equal(
            sanitizeHtml(
                '<a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a>',
            ),
            '<a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a>javascript</a>',
        );
    });
    it('should cope identically with capitalized attributes and tags and should tolerate capitalized schemes', function () {
        assert.equal(
            sanitizeHtml(
                '<A HREF="http://google.com">google</a><a href="HTTPS://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a>',
            ),
            '<a href="http://google.com">google</a><a href="HTTPS://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a>javascript</a>',
        );
    });
    it('should drop the content of script elements', function () {
        assert.equal(sanitizeHtml('<script>alert("ruhroh!");</script><p>Paragraph</p>'), '<p>Paragraph</p>');
    });
    it('should drop the content of style elements', function () {
        assert.equal(sanitizeHtml('<style>.foo { color: blue; }</style><p>Paragraph</p>'), '<p>Paragraph</p>');
    });
    it('should drop the content of textarea elements', function () {
        assert.equal(sanitizeHtml('<textarea>Nifty</textarea><p>Paragraph</p>'), '<p>Paragraph</p>');
    });
    it('should drop the content of option elements', function () {
        assert.equal(
            sanitizeHtml('<select><option>one</option><option>two</option></select><p>Paragraph</p>'),
            '<p>Paragraph</p>',
        );
    });
    it('should drop the content of textarea elements but keep the closing parent tag, when nested', function () {
        assert.equal(sanitizeHtml('<p>Paragraph<textarea>Nifty</textarea></p>'), '<p>Paragraph</p>');
    });
    it('should retain the content of fibble elements by default', function () {
        assert.equal(sanitizeHtml('<fibble>Nifty</fibble><p>Paragraph</p>'), 'Nifty<p>Paragraph</p>');
    });
    it('should discard the content of fibble elements if specified for nonTextTags', function () {
        assert.equal(
            sanitizeHtml('<fibble>Nifty</fibble><p>Paragraph</p>', { nonTextTags: ['fibble'] }),
            '<p>Paragraph</p>',
        );
    });
    it('should retain allowed tags within a fibble element if fibble is not specified for nonTextTags', function () {
        assert.equal(
            sanitizeHtml('<fibble>Ni<em>f</em>ty</fibble><p>Paragraph</p>', {}),
            'Ni<em>f</em>ty<p>Paragraph</p>',
        );
    });
    it('should discard allowed tags within a fibble element if fibble is specified for nonTextTags', function () {
        assert.equal(
            sanitizeHtml('<fibble>Ni<em>f</em>ty</fibble><p>Paragraph</p>', {
                nonTextTags: ['fibble'],
            }),
            '<p>Paragraph</p>',
        );
    });
    it('should preserve textarea content if textareas are allowed', function () {
        assert.equal(
            sanitizeHtml('<textarea>Nifty</textarea><p>Paragraph</p>', {
                allowedTags: ['textarea', 'p'],
            }),
            '<textarea>Nifty</textarea><p>Paragraph</p>',
        );
    });
    it('should preserve entities as such', function () {
        assert.equal(
            sanitizeHtml('<a name="&lt;silly&gt;">&lt;Kapow!&gt;</a>'),
            '<a name="&lt;silly&gt;">&lt;Kapow!&gt;</a>',
        );
    });
    it('should dump comments', function () {
        assert.equal(sanitizeHtml('<p><!-- Blah blah -->Whee</p>'), '<p>Whee</p>');
    });
    it('should dump an uppercase javascript url', function () {
        assert.equal(sanitizeHtml('<a href="JAVASCRIPT:alert(\'foo\')">Hax</a>'), '<a>Hax</a>');
    });
    it('should dump a javascript URL with a comment in the middle (probably only respected by browsers in XML data islands, but just in case someone enables those)', function () {
        assert.equal(sanitizeHtml('<a href="java<!-- -->script:alert(\'foo\')">Hax</a>'), '<a>Hax</a>');
    });
    it('should not mess up a hashcode with a : in it', function () {
        assert.equal(
            sanitizeHtml('<a href="awesome.html#this:stuff">Hi</a>'),
            '<a href="awesome.html#this:stuff">Hi</a>',
        );
    });
    it('should still like nice schemes', function () {
        assert.equal(sanitizeHtml('<a href="http://google.com/">Hi</a>'), '<a href="http://google.com/">Hi</a>');
    });
    it('should still like nice relative URLs', function () {
        assert.equal(sanitizeHtml('<a href="hello.html">Hi</a>'), '<a href="hello.html">Hi</a>');
    });
    it('should replace ol to ul', function () {
        assert.equal(
            sanitizeHtml('<ol><li>Hello world</li></ol>', { transformTags: { ol: 'ul' } }),
            '<ul><li>Hello world</li></ul>',
        );
    });
    it('should replace ol to ul and add class attribute with foo value', function () {
        assert.equal(
            sanitizeHtml('<ol><li>Hello world</li></ol>', {
                transformTags: { ol: sanitizeHtml.simpleTransform('ul', { class: 'foo' }) },
                allowedAttributes: { ul: ['class'] },
            }),
            '<ul class="foo"><li>Hello world</li></ul>',
        );
    });
    it('should replace ol to ul, left attributes foo and bar untouched, remove baz attribute and add class attributte with foo value', function () {
        assert.equal(
            sanitizeHtml('<ol foo="foo" bar="bar" baz="baz"><li>Hello world</li></ol>', {
                transformTags: { ol: sanitizeHtml.simpleTransform('ul', { class: 'foo' }) },
                allowedAttributes: { ul: ['foo', 'bar', 'class'] },
            }),
            '<ul foo="foo" bar="bar" class="foo"><li>Hello world</li></ul>',
        );
    });
    it('should replace ol to ul and replace all attributes to class attribute with foo value', function () {
        assert.equal(
            sanitizeHtml('<ol foo="foo" bar="bar" baz="baz"><li>Hello world</li></ol>', {
                transformTags: { ol: sanitizeHtml.simpleTransform('ul', { class: 'foo' }, false) },
                allowedAttributes: { ul: ['foo', 'bar', 'class'] },
            }),
            '<ul class="foo"><li>Hello world</li></ul>',
        );
    });
    it('should replace ol to ul and add attribute class with foo value and attribute bar with bar value', function () {
        assert.equal(
            sanitizeHtml('<ol><li>Hello world</li></ol>', {
                transformTags: {
                    ol: function (tagName, attribs) {
                        attribs.class = 'foo';
                        attribs.bar = 'bar';
                        return {
                            tagName: 'ul',
                            attribs: attribs,
                        };
                    },
                },
                allowedAttributes: { ul: ['bar', 'class'] },
            }),
            '<ul class="foo" bar="bar"><li>Hello world</li></ul>',
        );
    });

    it('should replace text and attributes when they are changed by transforming function', function () {
        assert.equal(
            sanitizeHtml('<a href="http://somelink">some text</a>', {
                transformTags: {
                    a: function (tagName, attribs) {
                        return {
                            tagName: tagName,
                            attribs: attribs,
                            text: '',
                        };
                    },
                },
            }),
            '<a href="http://somelink"></a>',
        );
    });

    it('should add new text when not initially set and replace attributes when they are changed by transforming function', function () {
        assert.equal(
            sanitizeHtml('<a href="http://somelink"></a>', {
                transformTags: {
                    a: function (tagName, attribs) {
                        return {
                            tagName: tagName,
                            attribs: attribs,
                            text: 'some new text',
                        };
                    },
                },
            }),
            '<a href="http://somelink">some new text</a>',
        );
    });

    it('should preserve text when initially set and replace attributes when they are changed by transforming function', function () {
        assert.equal(
            sanitizeHtml('<a href="http://somelink">some initial text</a>', {
                transformTags: {
                    a: function (tagName, attribs) {
                        return {
                            tagName: tagName,
                            attribs: attribs,
                        };
                    },
                },
            }),
            '<a href="http://somelink">some initial text</a>',
        );
    });

    it('should skip an empty link', function () {
        assert.strictEqual(
            sanitizeHtml('<p>This is <a href="http://www.linux.org"></a><br/>Linux</p>', {
                exclusiveFilter: function (frame) {
                    return frame.tag === 'a' && !frame.text.trim();
                },
            }),
            '<p>This is <br />Linux</p>',
        );
    });

    it("Should expose a node's inner text and inner HTML to the filter", function () {
        assert.strictEqual(
            sanitizeHtml('<p>12<a href="http://www.linux.org"><br/>3<br></a><span>4</span></p>', {
                exclusiveFilter: function (frame) {
                    if (frame.tag === 'p') {
                        assert.strictEqual(frame.text, '124');
                    } else if (frame.tag === 'a') {
                        assert.strictEqual(frame.text, '3');
                        return true;
                    } else if (frame.tag === 'br') {
                        assert.strictEqual(frame.text, '');
                    } else {
                        assert.fail('p, a, br', frame.tag);
                    }
                    return false;
                },
            }),
            '<p>124</p>',
        );
    });

    it('Should collapse nested empty elements', function () {
        assert.strictEqual(
            sanitizeHtml('<p><a href="http://www.linux.org"><br/></a></p>', {
                exclusiveFilter: function (frame) {
                    return (frame.tag === 'a' || frame.tag === 'p') && !frame.text.trim();
                },
            }),
            '',
        );
    });

    it('Should find child media elements that are in allowedTags', function () {
        var markup = '<a href="http://www.linux.org"><img /><video></video></a>';
        var sansVideo = '<a href="http://www.linux.org"><img /></a>';
        var sanitizedMarkup = sanitizeHtml(markup, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            exclusiveFilter: function (frame) {
                if (frame.tag === 'a') {
                    assert(frame.mediaChildren.length === 1);
                }

                return frame.tag === 'a' && !frame.text.trim() && !frame.mediaChildren.length;
            },
        });

        assert.strictEqual(sanitizedMarkup, sansVideo);
    });

    it('Exclusive filter should not affect elements which do not match the filter condition', function () {
        assert.strictEqual(
            sanitizeHtml('I love <a href="www.linux.org" target="_hplink">Linux</a> OS', {
                exclusiveFilter: function (frame) {
                    return frame.tag === 'a' && !frame.text.trim();
                },
            }),
            'I love <a href="www.linux.org" target="_hplink">Linux</a> OS',
        );
    });
    it('should disallow data URLs with default allowedSchemes', function () {
        assert.equal(
            sanitizeHtml(
                // teeny-tiny valid transparent GIF in a data URL
                '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />',
                {
                    allowedTags: ['img'],
                },
            ),
            '<img />',
        );
    });
    it('should allow data URLs with custom allowedSchemes', function () {
        assert.equal(
            sanitizeHtml(
                // teeny-tiny valid transparent GIF in a data URL
                '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />',
                {
                    allowedTags: ['img', 'p'],
                    allowedSchemes: ['data', 'http'],
                },
            ),
            '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />',
        );
    });
    it('should allow specific classes when whitelisted with allowedClasses', function () {
        assert.equal(
            sanitizeHtml('<p class="nifty simple dippy">whee</p>', {
                allowedTags: ['p'],
                allowedClasses: {
                    p: ['nifty'],
                },
            }),
            '<p class="nifty">whee</p>',
        );
    });
    it('should allow defining schemes on a per-tag basis', function () {
        assert.equal(
            sanitizeHtml(
                // teeny-tiny valid transparent GIF in a data URL
                '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><a href="https://www.example.com"></a>',
                {
                    allowedTags: ['img', 'a'],
                    allowedSchemes: ['http'],
                    allowedSchemesByTag: {
                        img: ['data'],
                        a: ['https'],
                    },
                },
            ),
            '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><a href="https://www.example.com"></a>',
        );
        assert.equal(
            sanitizeHtml(
                // teeny-tiny valid transparent GIF in a data URL
                '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><a href="https://www.example.com"></a>',
                {
                    allowedTags: ['img', 'a'],
                    allowedSchemes: ['http'],
                    allowedSchemesByTag: {
                        img: [],
                        a: ['https'],
                    },
                },
            ),
            '<img /><a href="https://www.example.com"></a>',
        );
    });
    it('should not act weird when the class attribute is empty', function () {
        assert.equal(
            sanitizeHtml('<p class="">whee</p>', {
                allowedTags: ['p'],
                allowedClasses: {
                    p: ['nifty'],
                },
            }),
            '<p>whee</p>',
        );
    });
    it('should not crash on bad markup', function () {
        assert.equal(sanitizeHtml('<p a'), '');
    });

    it('should deliver a warning if using vulnerable tags', function () {
        const spy = sinon.spy(console, 'warn');
        const message =
            '\n\n⚠️ Your `allowedTags` option includes, `style`, which is inherently\nvulnerable to XSS attacks. Please remove it from `allowedTags`.\nOr, to disable this warning, add the `allowVulnerableTags` option\nand ensure you are accounting for this risk.\n\n';

        sanitizeHtml('<style></style>', {
            allowedTags: ['style'],
        });

        assert(spy.calledWith(message));
        // Restore the spied-upon method
        console.warn.restore();
    });

    it('should not deliver a warning if using the allowVulnerableTags option', function () {
        const spy = sinon.spy(console, 'warn');

        sanitizeHtml('<style></style>', {
            allowVulnerableTags: true,
            allowedTags: ['style'],
        });

        assert(spy.notCalled);
        // Restore the spied-upon method
        console.warn.restore();
    });

    it('should allow only whitelisted attributes, but to any tags, if tag is declared as  "*"', function () {
        assert.equal(
            sanitizeHtml(
                '<table bgcolor="1" align="left" notlisted="0"><img src="1.gif" align="center" alt="not listed too"/></table>',
                {
                    allowedTags: ['table', 'img'],
                    allowedAttributes: {
                        '*': ['bgcolor', 'align', 'src'],
                    },
                },
            ),
            '<table bgcolor="1" align="left"><img src="1.gif" align="center" /></table>',
        );
    });
    it('should not filter if exclusive filter does not match after transforming tags', function () {
        assert.equal(
            sanitizeHtml('<a href="test.html">test</a>', {
                allowedTags: ['a'],
                allowedAttributes: { a: ['href', 'target'] },
                transformTags: {
                    a: function (tagName, attribs) {
                        if (!attribs.href) {
                            return false;
                        }
                        return {
                            tagName: tagName,
                            attribs: {
                                target: '_blank',
                                href: attribs.href,
                            },
                        };
                    },
                },
                exclusiveFilter: function (frame) {
                    return frame.tag === 'a' && frame.text.trim() === 'blah';
                },
            }),
            '<a target="_blank" href="test.html">test</a>',
        );
    });
    it('should filter if exclusive filter does match after transforming tags', function () {
        assert.equal(
            sanitizeHtml('<a href="test.html">blah</a>', {
                allowedTags: ['a'],
                allowedAttributes: { a: ['href', 'target'] },
                transformTags: {
                    a: function (tagName, attribs) {
                        if (!attribs.href) {
                            return false;
                        }
                        return {
                            tagName: tagName,
                            attribs: {
                                target: '_blank',
                                href: attribs.href,
                            },
                        };
                    },
                },
                exclusiveFilter: function (frame) {
                    return frame.tag === 'a' && frame.text.trim() === 'blah';
                },
            }),
            '',
        );
    });
    it("should allow transform on all tags using '*'", function () {
        assert.equal(
            sanitizeHtml('<p>Text</p>', {
                allowedTags: ['p'],
                allowedAttributes: { p: ['style'] },
                transformTags: {
                    '*': function (tagName, attribs) {
                        return {
                            tagName: tagName,
                            attribs: {
                                style: 'text-align: center',
                            },
                        };
                    },
                },
            }),
            '<p style="text-align:center">Text</p>',
        );
    });
    it('should allow attributes to be specified as globs', function () {
        assert.equal(
            sanitizeHtml('<a data-target="#test" data-foo="hello">click me</a>', {
                allowedTags: ['a'],
                allowedAttributes: { a: ['data-*'] },
            }),
            '<a data-target="#test" data-foo="hello">click me</a>',
        );
        assert.equal(
            sanitizeHtml('<a data-target="#test" data-my-foo="hello">click me</a>', {
                allowedTags: ['a'],
                allowedAttributes: { a: ['data-*-foo'] },
            }),
            '<a data-my-foo="hello">click me</a>',
        );
    });
    it('should quote regex chars in attributes specified as globs', function () {
        assert.equal(
            sanitizeHtml('<a data-b.c="#test" data-bcc="remove this">click me</a>', {
                allowedTags: ['a'],
                allowedAttributes: { a: ['data-b.*'] },
            }),
            '<a data-b.c="#test">click me</a>',
        );
    });
    it('should not escape inner content of script and style tags (when allowed)', function () {
        assert.equal(
            sanitizeHtml('<div>"normal text"</div><script>"this is code"</script>', {
                allowedTags: ['script'],
            }),
            '"normal text"<script>"this is code"</script>',
        );
        assert.equal(
            sanitizeHtml('<div>"normal text"</div><style>body { background-image: url("image.test"); }</style>', {
                allowedTags: ['style'],
            }),
            '"normal text"<style>body { background-image: url("image.test"); }</style>',
        );
    });
    it('should not unescape escapes found inside script tags', function () {
        assert.equal(
            sanitizeHtml('<script>alert("&quot;This is cool but just ironically so I quoted it&quot;")</script>', {
                allowedTags: ['script'],
            }),
            '<script>alert("&quot;This is cool but just ironically so I quoted it&quot;")</script>',
        );
    });
    it('should process text nodes with provided function', function () {
        assert.equal(
            sanitizeHtml('"normal text this should be removed"', {
                textFilter: function (text, tagName) {
                    return text.replace(' this should be removed', '');
                },
            }),
            '"normal text"',
        );
    });
    it('should skip text nodes based on tagName', function () {
        assert.equal(
            sanitizeHtml('<a>normal text this should be removed</a><b>normal text this should be removed</b>', {
                textFilter: function (text, tagName) {
                    if (tagName === 'a') {
                        return text;
                    }
                    return text.replace(' this should be removed', '');
                },
            }),
            '<a>normal text this should be removed</a><b>normal text</b>',
        );
    });
    it('should respect htmlparser2 options when passed in', function () {
        assert.equal(
            sanitizeHtml('<Archer><Sterling>I am</Sterling></Archer>', {
                allowedTags: false,
                allowedAttributes: false,
            }),
            '<archer><sterling>I am</sterling></archer>',
        );
        assert.equal(
            sanitizeHtml('<Archer><Sterling>I am</Sterling></Archer>', {
                allowedTags: false,
                allowedAttributes: false,
                parser: {
                    lowerCaseTags: false,
                },
            }),
            '<Archer><Sterling>I am</Sterling></Archer>',
        );
    });
    it('should not crash due to tag names that are properties of the universal Object prototype', function () {
        assert.equal(sanitizeHtml('!<__proto__>!'), '!!');
    });
    it('should correctly maintain escaping when allowing a nonTextTags tag other than script or style', function () {
        assert.equal(
            sanitizeHtml('!<textarea>&lt;/textarea&gt;&lt;svg/onload=prompt`xs`&gt;</textarea>!', {
                allowedTags: ['textarea'],
            }),
            '!<textarea>&lt;/textarea&gt;&lt;svg/onload=prompt`xs`&gt;</textarea>!',
        );
    });
    it('should allow protocol relative links by default', function () {
        assert.equal(sanitizeHtml('<a href="//cnn.com/example">test</a>'), '<a href="//cnn.com/example">test</a>');
    });
    it('should not allow protocol relative links when allowProtocolRelative is false', function () {
        assert.equal(
            sanitizeHtml('<a href="//cnn.com/example">test</a>', { allowProtocolRelative: false }),
            '<a>test</a>',
        );
        assert.equal(
            sanitizeHtml('<a href="/\\cnn.com/example">test</a>', { allowProtocolRelative: false }),
            '<a>test</a>',
        );
        assert.equal(
            sanitizeHtml('<a href="\\\\cnn.com/example">test</a>', {
                allowProtocolRelative: false,
            }),
            '<a>test</a>',
        );
        assert.equal(
            sanitizeHtml('<a href="\\/cnn.com/example">test</a>', { allowProtocolRelative: false }),
            '<a>test</a>',
        );
    });
    it('should still allow regular relative URLs when allowProtocolRelative is false', function () {
        assert.equal(
            sanitizeHtml('<a href="/welcome">test</a>', { allowProtocolRelative: false }),
            '<a href="/welcome">test</a>',
        );
    });
    it('should discard srcset by default', function () {
        assert.equal(
            sanitizeHtml('<img src="fallback.jpg" srcset="foo.jpg 100w 2x, bar.jpg 200w 1x" />', {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
            '<img src="fallback.jpg" />',
        );
    });
    it('should accept srcset if allowed', function () {
        assert.equal(
            sanitizeHtml('<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w" />', {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                allowedAttributes: { img: ['src', 'srcset'] },
            }),
            '<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w" />',
        );
    });
    it('should drop bogus srcset', function () {
        assert.equal(
            sanitizeHtml('<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w, javascript:alert(1) 100w" />', {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                allowedAttributes: { img: ['src', 'srcset'] },
            }),
            '<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w" />',
        );
    });
    it('should accept srcset with urls containing commas', function () {
        assert.equal(
            sanitizeHtml(
                '<img src="fallback.jpg" srcset="/upload/f_auto,q_auto:eco,c_fit,w_1460,h_2191/abc.jpg 1460w, /upload/f_auto,q_auto:eco,c_fit,w_1360,h_2041/abc.jpg" />',
                {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                    allowedAttributes: { img: ['src', 'srcset'] },
                },
            ),
            '<img src="fallback.jpg" srcset="/upload/f_auto,q_auto:eco,c_fit,w_1460,h_2191/abc.jpg 1460w, /upload/f_auto,q_auto:eco,c_fit,w_1360,h_2041/abc.jpg" />',
        );
    });
    it('should sanitize styles correctly', function () {
        var sanitizeString =
            '<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s><u>testestest</u></p><ul dir="ltr"> <li><u>test</u></li></ul><blockquote dir="ltr"> <ol> <li><u>​test</u></li><li><u>test</u></li><li style="text-align: right"><u>test</u></li><li style="text-align: justify"><u>test</u></li></ol> <p><u><span style="color:#00FF00">test</span></u></p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>';
        var expected =
            '<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s><u>testestest</u></p><ul dir="ltr"> <li><u>test</u></li></ul><blockquote dir="ltr"> <ol> <li><u>​test</u></li><li><u>test</u></li><li style="text-align: right"><u>test</u></li><li style="text-align: justify"><u>test</u></li></ol> <p><u><span style="color:#00FF00">test</span></u></p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>';
        assert.equal(
            sanitizeHtml(sanitizeString, {
                allowedTags: false,
                allowedAttributes: {
                    '*': ['dir'],
                    p: ['dir', 'style'],
                    li: ['style'],
                    span: ['style'],
                },
                allowedStyles: {
                    '*': {
                        // Matches hex
                        color: [/\#(0x)?[0-9a-f]+/i],
                        'text-align': [/left/, /right/, /center/, /justify/, /initial/, /inherit/],
                        'font-size': [/36px/],
                    },
                },
            }).replace(/ /g, ''),
            expected.replace(/ /g, ''),
        );
    });
    it('Should remove empty style tags', function () {
        assert.equal(
            sanitizeHtml("<span style=''></span>", {
                allowedTags: false,
                allowedAttributes: false,
            }),
            '<span></span>',
        );
    });
    it('Should remote invalid styles', function () {
        assert.equal(
            sanitizeHtml("<span style='color: blue; text-align: justify'></span>", {
                allowedTags: false,
                allowedAttributes: {
                    span: ['style'],
                },
                allowedStyles: {
                    span: {
                        color: [/blue/],
                        'text-align': [/left/],
                    },
                },
            }),
            '<span style="color:blue"></span>',
        );
    });
    it('Should allow a specific style from global', function () {
        assert.equal(
            sanitizeHtml("<span style='color: yellow; text-align: center; font-family: helvetica'></span>", {
                allowedTags: false,
                allowedAttributes: {
                    span: ['style'],
                },
                allowedStyles: {
                    '*': {
                        color: [/yellow/],
                        'text-align': [/center/],
                    },
                    span: {
                        color: [/green/],
                        'font-family': [/helvetica/],
                    },
                },
            }),
            '<span style="color:yellow;text-align:center;font-family:helvetica"></span>',
        );
    });
    it('Should allow hostnames in an iframe that are whitelisted', function () {
        assert.equal(
            sanitizeHtml('<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
            }),
            '<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
        );
    });
    it('Should remove iframe src urls that are not included in whitelisted hostnames', function () {
        assert.equal(
            sanitizeHtml('<iframe src="https://www.embed.vevo.com/USUV71704255"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
            }),
            '<iframe></iframe>',
        );
    });
    it('Should not allow iframe urls that do not have proper hostname', function () {
        assert.equal(
            sanitizeHtml('<iframe src="https://www.vimeo.com/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
            }),
            '<iframe></iframe>',
        );
    });
    it('Should allow iframe through if no hostname option is set', function () {
        assert.equal(
            sanitizeHtml('<iframe src="https://www.vimeo.com/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
            }),
            '<iframe src="https://www.vimeo.com/embed/c2IlcS7AHxM"></iframe>',
        );
    });
    it('Should allow domains in an iframe that are whitelisted', function () {
        assert.equal(
            sanitizeHtml('<iframe src="https://www.foo.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeDomains: ['zoom.us'],
            }),
            '<iframe src="https://www.foo.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>',
        );
    });
    it('Should allow second-level domains in an iframe that are whitelisted', function () {
        assert.equal(
            sanitizeHtml('<iframe src="https://zoom.us/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeDomains: ['zoom.us'],
            }),
            '<iframe src="https://zoom.us/embed/c2IlcS7AHxM"></iframe>',
        );
    });
    it('Should remove iframe src urls that are not included in whitelisted domains', function () {
        assert.equal(
            sanitizeHtml('<iframe src="https://www.prefix.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeDomains: ['vimeo.com'],
            }),
            '<iframe></iframe>',
        );
    });
    it(
        'Should remove iframe src urls with host that ends as whitelisted domains ' + ' but not preceeded with a dot',
        function () {
            assert.equal(
                sanitizeHtml('<iframe src="https://www.zoomzoom.us/embed/c2IlcS7AHxM"></iframe>', {
                    allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                    allowedAttributes: {
                        iframe: ['src', 'href'],
                        a: ['src', 'href'],
                        img: ['src'],
                    },
                    allowedIframeDomains: ['zoom.us'],
                }),
                '<iframe></iframe>',
            );
        },
    );
    it(
        'Should allow hostnames in an iframe that are whitelisted in allowedIframeHostnames ' +
            'and are not whitelisted in allowedIframeDomains',
        function () {
            assert.equal(
                sanitizeHtml('<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>', {
                    allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                    allowedAttributes: {
                        iframe: ['src', 'href'],
                        a: ['src', 'href'],
                        img: ['src'],
                    },
                    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
                    allowedIframeDomains: ['zoom.us'],
                }),
                '<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
            );
        },
    );
    it(
        'Should allow hostnames in an iframe that are not whitelisted in allowedIframeHostnames ' +
            'and are whitelisted in allowedIframeDomains',
        function () {
            assert.equal(
                sanitizeHtml('<iframe src="https://www.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>', {
                    allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                    allowedAttributes: {
                        iframe: ['src', 'href'],
                        a: ['src', 'href'],
                        img: ['src'],
                    },
                    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
                    allowedIframeDomains: ['zoom.us'],
                }),
                '<iframe src="https://www.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>',
            );
        },
    );
    it('Should allow relative URLs for iframes by default', function () {
        assert.equal(
            sanitizeHtml('<iframe src="/foo"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
            }),
            '<iframe src="/foo"></iframe>',
        );
    });
    it('Should allow relative URLs for iframes', function () {
        assert.equal(
            sanitizeHtml('<iframe src="/foo"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowIframeRelativeUrls: true,
            }),
            '<iframe src="/foo"></iframe>',
        );
    });
    it('Should remove relative URLs for iframes', function () {
        assert.equal(
            sanitizeHtml('<iframe src="/foo"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowIframeRelativeUrls: false,
            }),
            '<iframe></iframe>',
        );
    });
    it('Should remove relative URLs for iframes when whitelisted hostnames specified', function () {
        assert.equal(
            sanitizeHtml(
                '<iframe src="/foo"></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
                {
                    allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                    allowedAttributes: {
                        iframe: ['src', 'href'],
                        a: ['src', 'href'],
                        img: ['src'],
                    },
                    allowedIframeHostnames: ['www.youtube.com'],
                },
            ),
            '<iframe></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
        );
    });
    it('Should allow relative and whitelisted hostname URLs for iframes', function () {
        assert.equal(
            sanitizeHtml(
                '<iframe src="/foo"></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
                {
                    allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                    allowedAttributes: {
                        iframe: ['src', 'href'],
                        a: ['src', 'href'],
                        img: ['src'],
                    },
                    allowIframeRelativeUrls: true,
                    allowedIframeHostnames: ['www.youtube.com'],
                },
            ),
            '<iframe src="/foo"></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
        );
    });
    it('Should allow protocol-relative URLs for the right domain for iframes', function () {
        assert.equal(
            sanitizeHtml('<iframe src="//www.youtube.com/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
            }),
            '<iframe src="//www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
        );
    });
    it('Should not allow protocol-relative iframe urls that do not have proper hostname', function () {
        assert.equal(
            sanitizeHtml('<iframe src="//www.vimeo.com/embed/c2IlcS7AHxM"></iframe>', {
                allowedTags: ['p', 'iframe', 'a', 'img', 'i'],
                allowedAttributes: {
                    iframe: ['src', 'href'],
                    a: ['src', 'href'],
                    img: ['src'],
                },
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
            }),
            '<iframe></iframe>',
        );
    });
    it('Should only allow attributes to have any combination of specific values', function () {
        assert.equal(
            sanitizeHtml(
                '<iframe name="IFRAME" allowfullscreen="true" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"></iframe>',
                {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe']),
                    allowedAttributes: {
                        iframe: [
                            {
                                name: 'sandbox',
                                multiple: true,
                                values: ['allow-popups', 'allow-same-origin', 'allow-scripts'],
                            },
                            'allowfullscreen',
                        ],
                    },
                },
            ),
            '<iframe allowfullscreen="true" sandbox="allow-popups allow-same-origin allow-scripts"></iframe>',
        );
    });
    it('Should only allow attributes that match a specific value', function () {
        assert.equal(
            sanitizeHtml(
                '<iframe sandbox="allow-popups allow-modals"></iframe><iframe sandbox="allow-popups"></iframe><iframe sandbox="allow-scripts"></iframe>',
                {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe']),
                    allowedAttributes: {
                        iframe: [
                            {
                                name: 'sandbox',
                                multiple: false,
                                values: ['allow-popups', 'allow-same-origin', 'allow-scripts'],
                            },
                        ],
                    },
                },
            ),
            '<iframe sandbox></iframe><iframe sandbox="allow-popups"></iframe><iframe sandbox="allow-scripts"></iframe>',
        );
    });
    it('Should not allow cite urls that do not have an allowed scheme', function () {
        assert.equal(
            sanitizeHtml(
                '<q cite="http://www.google.com">HTTP</q><q cite="https://www.google.com">HTTPS</q><q cite="mailto://www.google.com">MAILTO</q><q cite="tel://www.google.com">TEL</q><q cite="ftp://www.google.com">FTP</q><q cite="data://www.google.com">DATA</q><q cite="ldap://www.google.com">LDAP</q><q cite="acrobat://www.google.com">ACROBAT</q><q cite="vbscript://www.google.com">VBSCRIPT</q><q cite="file://www.google.com">FILE</q><q cite="rlogin://www.google.com">RLOGIN</q><q cite="webcal://www.google.com">WEBCAL</q><q cite="javascript://www.google.com">JAVASCRIPT</q><q cite="mms://www.google.com">MMS</q>',
                {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['q']),
                    allowedAttributes: { q: ['cite'] },
                    allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['tel']),
                },
            ),
            '<q cite="http://www.google.com">HTTP</q><q cite="https://www.google.com">HTTPS</q><q cite="mailto://www.google.com">MAILTO</q><q cite="tel://www.google.com">TEL</q><q cite="ftp://www.google.com">FTP</q><q>DATA</q><q>LDAP</q><q>ACROBAT</q><q>VBSCRIPT</q><q>FILE</q><q>RLOGIN</q><q>WEBCAL</q><q>JAVASCRIPT</q><q>MMS</q>',
        );
    });
});
