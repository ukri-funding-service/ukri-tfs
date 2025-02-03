import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import chai, { expect } from 'chai';
import { BlobInfo, RichTextEditor, RichTextEditorProps } from '../../../src';
import { getWordCount } from '../../../src/helpers/wordCount';
import { invalidResult, validResult } from '../factories/ValidationResult';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

describe('<RichTextEditor /> component tests', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
        chai.use(sinonChai);
    });

    afterEach(() => {
        if (wrapper !== undefined) {
            wrapper.unmount();
        }
    });

    it('should set name', () => {
        wrapper = render(<RichTextEditor name="my-textarea" />);
        const textarea = Array.from(wrapper.container.querySelectorAll('textarea.rte-textarea'));
        expect(textarea).to.not.be.undefined;
        expect(textarea).to.have.lengthOf(1);
        expect(textarea[0].getAttribute('name')).to.equal('my-textarea');
    });

    it('should set class if provided', () => {
        wrapper = render(
            <RichTextEditor
                name="my-textarea"
                className="custom-class"
                wordCountAllowed={3}
                defaultValue={'one two three four'}
            />,
        );
        expect(wrapper.container.querySelector('div.custom-class')).to.not.be.null;
    });

    it('should set rte with externally provided tinymce script path', () => {
        wrapper = render(
            <RichTextEditor
                name="my-textarea"
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                height={800}
                rows={10}
                wordCountAllowed={3}
                textareaLabel={'Text Area Label'}
                defaultValue={'Placeholder text'}
                contentCssPaths={[]}
                useCssFromNextJs={false}
                disabled
                showWordCount
            />,
        );
        expect(wrapper.container.querySelector('textarea.rte-textarea')).to.not.be.null;
    });

    it('should ensure all the methods workable', () => {
        // testing private property
        class TestRichTextEditor extends RichTextEditor {
            constructor(props: RichTextEditorProps) {
                super(props);
            }
            onImageChangeTest(newContent: string, previousContent: string) {
                return this.onImageChange(newContent, previousContent);
            }
        }
        const rte = new TestRichTextEditor({ name: 'my-textarea' });

        rte.onImageChangeTest('<img title="bcd" />', '<img title="abc" />');
        expect(rte).haveOwnProperty('setupTables');
    });

    it('should not have class govuk-textarea--error when not in error', () => {
        wrapper = render(<RichTextEditor name="my-textarea" />);
        expect(wrapper.container.querySelectorAll('div.govuk-input--error')).to.have.lengthOf(0);
    });

    it('should not have class govuk-textarea--error when has invalid validation result', () => {
        wrapper = render(<RichTextEditor name="my-textarea" validation={invalidResult} />);
        expect(wrapper.container.querySelectorAll('div.govuk-input--error')).to.have.lengthOf(1);
    });

    it('should not have class govuk-textarea--error when it has a valid validation result', () => {
        wrapper = render(<RichTextEditor name="my-textarea" validation={validResult} />);
        expect(wrapper.container.querySelectorAll('div.govuk-input--error')).to.have.lengthOf(0);
    });

    it('should have class govuk-textarea--error when in error', () => {
        wrapper = render(<RichTextEditor name="my-textarea" isError />);
        expect(wrapper.container.querySelectorAll('div.govuk-input--error')).to.have.lengthOf(1);
    });

    it('Should contain subscript function when editor type is enhanced', () => {
        const rte = new RichTextEditor({ name: 'my-textarea', editorType: 'enhanced' });
        expect(rte.init.toolbar).to.include('subscript');
    });

    it('Should not contain subscript function when subscript is overridden as false', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
            editorType: 'enhanced',
            rteOverrides: { subscript: false },
        });
        expect(rte.init.toolbar).to.not.include('subscript');
    });

    it('Should contain superscript function when editor type is enhanced', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
            editorType: 'enhanced',
        });
        expect(rte.init.toolbar).to.include('superscript');
    });

    it('Should not contain superscript function when superscript is overridden as false', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
            editorType: 'enhanced',
            rteOverrides: {
                superscript: false,
            },
        });
        expect(rte.init.toolbar).to.not.include('superscript');
    });

    it('Should contain image function when image is overridden as true', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
            editorType: 'enhanced',
            rteOverrides: {
                image: true,
            },
        });
        expect(rte.init.toolbar).to.include('image');
    });

    it('Should have browser browser_spellcheck enabled', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
        });
        expect(rte.init.browser_spellcheck).to.equal(true);
    });

    it('Should contain help icon in the toolbar', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
            editorType: 'enhanced',
        });
        expect(rte.init.toolbar).to.include('help');
    });

    it('Should contain help dialog with shortcuts tab', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
            editorType: 'enhanced',
        });
        expect(rte.init.help_tabs).to.include('shortcuts');
    });

    it('Should contain help dialog with keyboard navigation tab', () => {
        const rte = new RichTextEditor({
            name: 'my-textarea',
            editorType: 'enhanced',
        });
        expect(rte.init.help_tabs).to.include('keyboardnav');
    });

    describe('getWordCount', () => {
        it('should not count words with em dashes as a single words', () => {
            const text = "<p>word another word here's another word this—shouldn't—work</p>";
            const expected = 9;
            expect(getWordCount(text, 20).wordCount).to.equal(expected);
        });

        it('should not count em dashes as a word at start of sentence', () => {
            const text = '<p> — this is four words</p>';
            const expected = 4;
            expect(getWordCount(text, 20).wordCount).to.equal(expected);
        });

        it('should indicate when max characters have been exceeded', () => {
            const text = '<p>too many words</p>';
            expect(getWordCount(text, 1).isOverAllowedWordCount).to.equal(true);
        });
    });

    describe('hintTextFn', () => {
        it('should set hintText if hintTextFn is provided', () => {
            const hintTextFn = () => 'Custom hint text';
            wrapper = render(
                <RichTextEditor
                    name="my-textarea"
                    className="custom-class"
                    wordCountAllowed={3}
                    defaultValue={'one two three four'}
                    hintTextFn={hintTextFn}
                />,
            );

            expect(wrapper.container.querySelector('div.custom-class')).to.not.be.null;
            const hintTextElement = wrapper.container.querySelector('#more-detail-info-my-textarea');
            expect(hintTextElement).to.not.be.null;
            expect(hintTextElement!.textContent).to.equal('Custom hint text');
        });
    });

    describe('init - image_upload_handler', () => {
        it('calls the imagesUploadHandler if provided with a valid image type', () => {
            const imagesUploadHandlerStub = sinon.stub();
            const rte = new RichTextEditor({ imagesUploadHandler: imagesUploadHandlerStub, name: 'blah' });
            const props = rte.init;
            if (!props.images_upload_handler) {
                throw new Error('No image upload handler');
            }

            const blobStub = sinon.stub().returns({ type: 'image/png' });
            props.images_upload_handler({ blob: blobStub } as unknown as BlobInfo, sinon.stub(), sinon.stub());
            expect(imagesUploadHandlerStub).to.have.been.called;
        });

        it('should call the failure stub and provided imageUploadHandler when provided with an invalid image type', () => {
            const imagesUploadHandlerStub = sinon.stub();
            const rte = new RichTextEditor({ imagesUploadHandler: imagesUploadHandlerStub, name: 'blah' });
            const props = rte.init;
            if (!props.images_upload_handler) {
                throw new Error('No image upload handler');
            }

            const failureStub = sinon.stub();
            const blobStub = sinon.stub().returns({ type: 'image/tiff' });
            props.images_upload_handler({ blob: blobStub } as unknown as BlobInfo, sinon.stub(), failureStub);
            expect(imagesUploadHandlerStub).to.have.not.been.called;
            expect(failureStub).to.have.been.called;
        });

        it('should call the failure stub when provided with an invalid image type when imageUploadHandler is undefined', () => {
            const mySpy = sinon.spy();
            const rte = new RichTextEditor({ imagesUploadHandler: mySpy, name: 'blah' });
            const props = rte.init;
            if (!props.images_upload_handler) {
                throw new Error('No image upload handler');
            }

            const failureStub = sinon.stub();
            const blobStub = sinon.stub().returns({ type: 'image/tiff' });
            props.images_upload_handler({ blob: blobStub } as unknown as BlobInfo, sinon.stub(), failureStub);
            expect(failureStub).to.have.been.called;
            expect(mySpy).to.have.not.been.called;
        });
    });
});
