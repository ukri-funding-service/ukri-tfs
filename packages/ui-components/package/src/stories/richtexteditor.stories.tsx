import { boolean, number, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { RichTextEditor } from '../components/richTextEditor';
import { invalidValidationResult } from './util/ExampleValidationResults';

const stories = storiesOf('Components', module);
stories.add('InvalidRichTextEditor', () => (
    <div className="js-enabled">
        <RichTextEditor
            validation={invalidValidationResult}
            editorType="enhanced"
            name={text('Name', 'rich_text_test_rte')}
            defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
        <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
            useCssFromNextJs={true}
            wordCountAllowed={number('Word count allowed', 50)}
            disabled={true}
            tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.7.1/tinymce.min.js"
        />
    </div>
));

stories.add('RichTextEditor', () => (
    <div className="js-enabled">
        <RichTextEditor
            editorType="enhanced"
            name={text('Name', 'rich_text_test_rte')}
            defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
            <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
            useCssFromNextJs={true}
            wordCountAllowed={number('Word count allowed', 25)}
            disabled={true}
            tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.7.1/tinymce.min.js"
        />
    </div>
));

stories.add('RichTextEditor (enhanced)', () => (
    <div className="js-enabled">
        <RichTextEditor
            name={text('Name', 'rich_text_test_rte')}
            defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
            <p><b>showCodeTools</b> (source code button) is enabled for Storybook but disabled by default.</p>
            <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
            isError={boolean('isError', false)}
            rteOverrides={{ code: true, advlist: true }}
            useCssFromNextJs={true}
            wordCountAllowed={number('Word count allowed', 250)}
            editorType="enhanced"
        />
    </div>
));

stories.add('RichTextEditor (multiple)', () => (
    <div className="js-enabled">
        <React.Fragment>
            <RichTextEditor
                name="rich_text_test_rte1"
                defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
                <p><b>showCodeTools</b> (source code button) is enabled for Storybook but disabled by default.</p>
                <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
                editorType="enhanced"
            />
            <hr />
            <RichTextEditor
                name="rich_text_test_rte2"
                defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
                <p><b>showCodeTools</b> (source code button) is enabled for Storybook but disabled by default.</p>
                <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
                editorType="enhanced"
            />
            <hr />
            <RichTextEditor
                name="rich_text_test_rte3"
                defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
                <p><b>showCodeTools</b> (source code button) is enabled for Storybook but disabled by default.</p>
                <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
                editorType="enhanced"
            />
            <hr />
            <RichTextEditor
                name="rich_text_test_rte4"
                defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
                <p><b>showCodeTools</b> (source code button) is enabled for Storybook but disabled by default.</p>
                <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
                editorType="enhanced"
            />
            <hr />
            <RichTextEditor
                name="rich_text_test_rte5"
                defaultValue="<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
                <p><b>showCodeTools</b> (source code button) is enabled for Storybook but disabled by default.</p>
                <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>"
                editorType="enhanced"
            />
            <hr />
        </React.Fragment>
    </div>
));

stories.add('RichTextEditor (plain text)', () => (
    <div className="js-enabled">
        <RichTextEditor
            name={text('Name', 'rich_text_test_rte')}
            defaultValue={`This is\r\na test of\nhandling     plain text.\r\n\r\nThis text should span 5 lines.\n\tone tab\n\t\ttwo tabs\n\t\t\tthree tabs`}
            isError={boolean('isError', false)}
            rteOverrides={{ code: true }}
            useCssFromNextJs={true}
            wordCountAllowed={number('Word count allowed', 250)}
            editorType="enhanced"
        />
    </div>
));

stories.add('RichTextEditor basic & table', () => (
    <div className="js-enabled">
        <RichTextEditor
            name={text('Name', 'rich_text_test_rte')}
            defaultValue={`<p>Lorem <strong>ipsum dolor</strong> sit amet <i>etc. etc.</i></p>
            <p>Most of the props for this component aren't shown below as they require a full re-render which isn't supported by Storybook</p>`}
            isError={boolean('isError', false)}
            useCssFromNextJs={true}
            wordCountAllowed={number('Word count allowed', 250)}
            editorType="basic"
            rteOverrides={{
                table: true,
                link: true,
                underline: true,
                code: true,
            }}
        />
    </div>
));
