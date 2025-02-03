import { describe, expect, it } from '@jest/globals';
import {
    GetHtmlCleanOptions,
    HtmlCleanOptions,
    defaultHtmlCleanOptions,
    htmlClean,
    simpleRichTextEditorCleanOptions,
} from '../../src/sanitisation/htmlClean';

describe('Data Sanitisation', () => {
    describe('Basic functionality', () => {
        it('Should remove all HTML from a string containing only HTML', () => {
            // given
            const dirty = '<div><p>test</p></div>';

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual('');
        });

        it("Should not change this string '!`¬£$%^&*()_-+=[]{};:'@'~#,.<>?\\/", () => {
            // given
            const dirty = "'!`¬£$%^&*()_-+=[]{};:'@'~#,.<>?\\/";

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual("'!`¬£$%^&*()_-+=[]{};:'@'~#,.<>?\\/");
        });

        it('Should remove <p> tagged HTML from a string', () => {
            // given
            const dirty = 'foo<p>test</p>bar';

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual('foobar');
        });

        it('Should not remove any characters from a string that contains no HTML', () => {
            // given
            const dirty = 'foo test bar';

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual('foo test bar');
        });

        it('Should not remove a string between two self closing tags', () => {
            // given
            const dirty = '<hr>test<hr>';

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual('test');
        });

        it('Should remove a tag that is not HTML standard', () => {
            // given
            const dirty = '<foo>test</foo>';

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual('');
        });

        it('Should remove a tag that is not HTML standard and not closed properly', () => {
            // given
            const dirty = '<foo>test<bar>test';

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual('');
        });

        it('should not decode html entities', () => {
            const dirty = '&lt;test&gt;';

            const clean = htmlClean(dirty);

            expect(clean).toEqual(dirty);
        });
    });

    describe('Types', () => {
        it('Should remove <p> tagged HTML from a string', () => {
            // given
            const dirty = '<p>foo</p>bar';

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual('bar');
        });

        it('Should remove <p> tagged HTML from an object of string values containing HTML', () => {
            // given
            const dirty = { foo: '<a href="www.foo.com"></a>', bar: 'something else' };

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual({ foo: '', bar: 'something else' });
        });

        it('Should remove <p> tagged HTML from a list of strings containing HTML', () => {
            // given
            const dirty = ['<a href="www.foo.com"></a>', 'something else'];

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual(['', 'something else']);
        });

        it.each([{ value: true }, { value: 1 }, { value: undefined }])(
            'should return unsupported type ($value) unchanged',
            ({ value }) => {
                // given
                const dirty = value;

                // when
                const clean = htmlClean(dirty);

                // then
                expect(clean).toEqual(value);
            },
        );
    });

    describe('Nested objects and lists', () => {
        it('should remove all instances of HTML in a nested object of objects', () => {
            // given
            const dirtyObj = {
                foo1: '<a href="www.foo.com"></a>',
                bar1: {
                    foo2: '<a href="www.foo.com"></a>',
                    bar2: {
                        foo3: '<a href="www.foo.com"></a>',
                        bar3: 'something else',
                    },
                },
            };

            // when
            const clean = htmlClean(dirtyObj);

            // then
            expect(clean).toEqual({
                foo1: '',
                bar1: {
                    foo2: '',
                    bar2: {
                        foo3: '',
                        bar3: 'something else',
                    },
                },
            });
        });

        it('should remove all instances of HTML in a nested object of lists', () => {
            // given
            const dirty = {
                foo1: '<a href="www.foo.com"></a>',
                bar1: [
                    [
                        ['<a href="www.foo.com"></a>', '<span>text</span>', '<h1>foo</h1>'],
                        ['<a href="www.foo.com"></a>', 'plaintext'],
                    ],
                ],
            };

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual({
                foo1: '',
                bar1: [
                    [
                        ['', '', ''],
                        ['', 'plaintext'],
                    ],
                ],
            });
        });

        it('should remove all instances of HTML in a nested list of lists', () => {
            // given
            const dirty = [
                [
                    [
                        ['<a href="www.foo.com"></a>', '<span>text</span>', '<h1>foo</h1>'],
                        ['<a href="www.foo.com"></a>', 'plaintext'],
                    ],
                ],
            ];

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual([
                [
                    [
                        ['', '', ''],
                        ['', 'plaintext'],
                    ],
                ],
            ]);
        });

        it('should remove all instances of HTML in a nested list of objects', () => {
            // given
            const dirty = [
                {
                    foo1: '<a href="www.foo.com"></a>',
                },
                {
                    bar1: {
                        foo2: '<a href="www.foo.com"></a>',
                        bar2: {
                            foo3: '<a href="www.foo.com"></a>',
                            bar3: 'something else',
                        },
                    },
                },
                {
                    bar2: 'plaintext',
                },
            ];

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).toEqual([
                {
                    foo1: '',
                },
                {
                    bar1: {
                        foo2: '',
                        bar2: {
                            foo3: '',
                            bar3: 'something else',
                        },
                    },
                },
                {
                    bar2: 'plaintext',
                },
            ]);
        });
    });

    describe('XSS crafting', () => {
        it('should not be able to craft a string to turn into a malicious string', () => {
            // given
            const dirty = "<scr<p>something</p>ipt>eval('something bad');";

            // when
            const clean = htmlClean(dirty);

            // then
            expect(clean).not.toEqual("<script>eval('something bad');");
            expect(clean).not.toContain('script');
            expect(clean).not.toContain('eval');
            expect(clean).not.toContain('something bad');
        });
    });

    describe('Ignore fields', () => {
        it('should not remove any html from a field defined in the ignore fields within a flat object', () => {
            // given
            const dirty = {
                foo: '<a href="www.foo.com"></a>',
            };

            // when
            const clean = htmlClean(dirty, { ...defaultHtmlCleanOptions, ignoreFields: ['foo'] });

            // then
            expect(clean).toEqual(dirty);
        });

        it('should not remove any html from a field defined in the ignore fields within a nested object', () => {
            // given
            const dirty = {
                foo1: '<a href="www.foo.com"></a>',
                bar: {
                    foo2: '<a href="www.foo.com"></a>',
                },
            };

            // when
            const clean = htmlClean(dirty, { ...defaultHtmlCleanOptions, ignoreFields: ['foo2'] });

            // then
            expect(clean).toEqual({
                foo1: '',
                bar: {
                    foo2: '<a href="www.foo.com"></a>',
                },
            });
        });

        it('should remove all html from an object where no ignoreFields are defined', () => {
            // given
            const dirty = {
                foo1: '<a href="www.foo.com"></a>',
                bar: {
                    foo2: '<a href="www.foo.com"></a>',
                },
            };

            // when
            const clean = htmlClean(dirty, { ...defaultHtmlCleanOptions, ignoreFields: [] });

            // then
            expect(clean).toEqual({
                foo1: '',
                bar: {
                    foo2: '',
                },
            });
        });
    });

    describe('Clean options function', () => {
        it('should not remove any html from a field defined in the ignore fields within a flat object', () => {
            // given
            const dirty = {
                foo: '<a href="www.foo.com"></a>',
            };

            const getCleanOptions: GetHtmlCleanOptions = (_value, _propsPath): HtmlCleanOptions => {
                return { ...defaultHtmlCleanOptions, ignoreFields: ['foo'] };
            };

            // when
            const clean = htmlClean(dirty, getCleanOptions);

            // then
            expect(clean).toEqual(dirty);
        });

        it('should remove all html from an object where no ignoreFields are defined', () => {
            // given
            const dirty = {
                foo1: '<a href="www.foo.com"></a>',
                bar: {
                    foo2: '<a href="www.foo.com"></a>',
                },
            };

            const getCleanOptions: GetHtmlCleanOptions = (_value, _propsPath): HtmlCleanOptions => {
                return { ...defaultHtmlCleanOptions, ignoreFields: [] };
            };

            // when
            const clean = htmlClean(dirty, getCleanOptions);

            // then
            expect(clean).toEqual({
                foo1: '',
                bar: {
                    foo2: '',
                },
            });
        });

        it('should clean HTML according to options returned by the clean options function', () => {
            // given
            const dirty = {
                foo1: '<a href="www.foo.com"></a>',
                bar: {
                    foo2: '<a href="www.foo.com"></a>',
                },
            };

            const getCleanOptions: GetHtmlCleanOptions = (_value, propsPath): HtmlCleanOptions => {
                if (propsPath === 'bar.foo2') {
                    return {
                        ...defaultHtmlCleanOptions,
                        allowedTags: ['a'],
                        allowedAttributes: { a: ['href'] },
                    };
                }
                return { ...defaultHtmlCleanOptions, ignoreFields: [] };
            };

            // when
            const clean = htmlClean(dirty, getCleanOptions);

            // then
            expect(clean).toEqual({
                foo1: '',
                bar: {
                    foo2: '<a href="www.foo.com"></a>',
                },
            });
        });

        it('should clean HTML in arrays according to options returned by the clean options function', () => {
            // given
            const dirty = [
                '<a href="www.foo.com"></a>',
                {
                    foo2: '<a href="www.foo.com"></a>',
                },
            ];

            const getCleanOptions: GetHtmlCleanOptions = (_value, propsPath): HtmlCleanOptions => {
                if (propsPath === '[1].foo2') {
                    return {
                        ...defaultHtmlCleanOptions,
                        allowedTags: ['a'],
                        allowedAttributes: { a: ['href'] },
                    };
                }
                return { ...defaultHtmlCleanOptions, ignoreFields: [] };
            };

            // when
            const clean = htmlClean(dirty, getCleanOptions);

            // then
            expect(clean).toEqual([
                '',
                {
                    foo2: '<a href="www.foo.com"></a>',
                },
            ]);
        });
    });

    describe('Simple rich text editor clean options', () => {
        it('should not remove p tag', () => {
            const dirty = '<p>Paragraph</p>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-body class from p tag', () => {
            const dirty = '<p class="govuk-body">Paragraph</p>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other class from p tag', () => {
            const dirty = '<p class="normal-size">Paragraph</p>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<p>Paragraph</p>');
        });

        it('should not remove padding-left style from p tag', () => {
            const dirty = '<p style="padding-left:20px">Paragraph</p>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other style from p tag', () => {
            const dirty = '<p style="font-size:20px">Paragraph</p>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<p>Paragraph</p>');
        });

        it('should not remove strong tag', () => {
            const dirty = '<strong>Bold</strong>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any class from strong tag', () => {
            const dirty = '<strong class="big-bold">Bold</strong>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<strong>Bold</strong>');
        });

        it('should not remove em tag', () => {
            const dirty = '<em>Italics</em>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any class from em tag', () => {
            const dirty = '<em class="big-italic">Italics</em>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<em>Italics</em>');
        });

        it('should not remove h1 tag', () => {
            const dirty = '<h1>Heading</h1>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-heading-l class from h1 tag', () => {
            const dirty = '<h1 class="govuk-heading-l">Heading</h1>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other class from h1 tag', () => {
            const dirty = '<h1 class="big-heading">Heading</h1>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<h1>Heading</h1>');
        });

        it('should not remove h2 tag', () => {
            const dirty = '<h2>Medium Heading</h2>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-heading-m class from h2 tag', () => {
            const dirty = '<h2 class="govuk-heading-m">Medium Heading</h2>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other class from h2 tag', () => {
            const dirty = '<h2 class="smaller-heading">Medium Heading</h2>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<h2>Medium Heading</h2>');
        });

        it('should not remove h3 tag', () => {
            const dirty = '<h3>Small Heading</h3>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-heading-s class from h3 tag', () => {
            const dirty = '<h3 class="govuk-heading-s">Small Heading</h3>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other class from h3 tag', () => {
            const dirty = '<h3 class="smallest-heading">Small Heading</h3>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<h3>Small Heading</h3>');
        });

        it('should not remove ul tag', () => {
            const dirty = '<ul><li>One</li></ul>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-list class from ul tag', () => {
            const dirty = '<ul class="govuk-list"><li>One</li></ul>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-list--bullet class from ul tag', () => {
            const dirty = '<ul class="govuk-list--bullet"><li>One</li></ul>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other class from ul tag', () => {
            const dirty = '<ul class="bulletpoints"><li>One</li></ul>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<ul><li>One</li></ul>');
        });

        it('should not remove ol tag', () => {
            const dirty = '<ol><li>One</li></ol>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-list class from ol tag', () => {
            const dirty = '<ol class="govuk-list"><li>One</li></ol>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-list--number class from ol tag', () => {
            const dirty = '<ol class="govuk-list--number"><li>One</li></ol>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other class from ol tag', () => {
            const dirty = '<ol class="numbered"><li>One</li></ol>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<ol><li>One</li></ol>');
        });

        it('should not remove a tag', () => {
            const dirty = '<a>Link</a>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove govuk-link class from a tag', () => {
            const dirty = '<a class="govuk-link">Link</a>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other class from a tag', () => {
            const dirty = '<a class="numbered">Link</a>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual('<a>Link</a>');
        });

        it('should not remove href attribute from a tag', () => {
            const dirty = '<a href="https://www.ukri.org/">Link</a>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove target attribute from a tag', () => {
            const dirty = '<a target="_blank">Link</a>';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove img tag', () => {
            const dirty = '<img src="https://www.ukri.org/" />';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove src attribute on img tag', () => {
            const dirty = '<img src="https://www.ukri.org/" alt="https://www.ukri2.org/" />';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove app-image-id attribute on img tag', () => {
            const dirty = '<img src="https://www.ukri.org/" app-image-id="testid" />';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove height attribute on img tag', () => {
            const dirty = '<img src="https://www.ukri.org/" height="50" />';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should not remove width attribute on img tag', () => {
            const dirty = '<img src="https://www.ukri.org/" width="50" />';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(dirty);
        });

        it('should remove any other attribute on img tag', () => {
            const dirty = '<img src="https://www.ukri.org/" usemap="#workmap" />';

            const expected = '<img src="https://www.ukri.org/" />';

            const clean = htmlClean(dirty, simpleRichTextEditorCleanOptions);

            expect(clean).toEqual(expected);
        });
    });
});
