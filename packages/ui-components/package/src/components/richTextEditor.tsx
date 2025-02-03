import { Editor as ReactEditor } from '@tinymce/tinymce-react';
import { errorFormat, ValidationResult } from '@ukri-tfs/validation';
import cx from 'classnames';
import { Hint, Label } from 'govuk-react-jsx';
import React from 'react';
import { Editor, EditorEvent } from 'tinymce/tinymce';
import { getWordCount } from '../helpers';
import { multiValidationTypes } from '../helpers/multiValidationTypes';
const debounce = require('lodash/debounce');

export interface BlobInfo {
    id: () => string;
    name: () => string;
    filename: () => string;
    blob: () => Blob;
    base64: () => string;
    blobUri: () => string;
    uri: () => string | undefined;
}

export type ErrorFormatWithHiddenAndImageId = errorFormat & {
    applicationImageId?: string;
    hidden?: boolean;
};

interface UploadFailureOptions {
    remove?: boolean;
}

export type ImagesUploadHandler = (
    blobInfo: BlobInfo,
    success: (url: string) => void,
    failure: (err: string, options?: UploadFailureOptions) => void,
    progress?: (percent: number) => void,
) => void;

export interface RichTextEditorProps {
    name: string;
    className?: string;
    editorType?: 'basic' | 'enhanced';
    defaultValue?: string;
    onChange?: (e: string) => void;
    disabled?: boolean;
    showCodeTools?: boolean;
    showStatusBar?: boolean;
    contentCssPaths?: string[];
    useCssFromNextJs?: boolean;
    height?: number;
    wordCountAllowed?: number;
    onWordCountChange?: (wordCount: number, isOverAllowedWordCount: boolean) => void;
    showWordCount?: boolean;
    rows?: number;
    title?: string;
    enablePasteDataImages?: boolean;
    handleChange?: (editor: RichTextEditor) => void;
    rteOverrides?: {
        formatselect?: boolean;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        bullist?: boolean;
        numlist?: boolean;
        advlist?: boolean;
        lists?: boolean;
        outdent?: boolean;
        indent?: boolean;
        paste?: boolean;
        tabfocus?: boolean;
        link?: boolean;
        autolink?: boolean;
        table?: boolean;
        code?: boolean;
        help?: boolean;
        superscript?: boolean;
        subscript?: boolean;
        image?: boolean;
    };
    tinymceScriptSrc?: string;
    validation?: ValidationResult;
    //isError is deprecated, use validation instead
    isError?: boolean;
    imagesUploadHandler?: ImagesUploadHandler;
    extendedValidElements?: string;
    setShowError?: React.Dispatch<React.SetStateAction<ErrorFormatWithHiddenAndImageId[]>>;
    latestImageName?: string;
    textareaLabel?: string;
    hintTextFn?: (wordCountRemaining: number, overWordCount: boolean) => string;
}

interface RichTextEditorState {
    wordCount: number;
    wordCountRemaining: number;
    isOverAllowedWordCount: boolean;
    content: string;
}

interface ReactEditorInitProps {
    a11y_advanced_options: boolean;
    a11ychecker_allow_decorative_images: boolean;
    advlist_bullet_styles: string;
    advlist_number_styles: string;
    block_formats: string;
    branding: boolean;
    browser_spellcheck: boolean;
    content_css: string[];
    content_style: string;
    contextmenu: string | false | undefined;
    convert_urls: boolean;
    default_link_target: string;
    extended_valid_elements: string | undefined;
    fixed_toolbar_container: string;
    height: number;
    help_tabs: string[];
    hidden_input: boolean;
    image_advtab: boolean;
    image_description: boolean;
    image_dimensions: boolean;
    image_title: boolean;
    images_file_types: string;
    images_upload_handler: ImagesUploadHandler | undefined;
    link_assume_external_targets: boolean;
    link_context_toolbar: boolean;
    link_title: boolean;
    menubar: boolean;
    paste_data_images: boolean | undefined;
    plugins: string;
    resize: boolean;
    setup: (editor: Editor) => void;
    statusbar: boolean;
    style_formats_merge: boolean;
    tabfocus_elements: string;
    table_advtab: boolean;
    table_appearance_options: boolean;
    table_cell_advtab: boolean;
    table_column_resizing: string;
    table_row_advtab: boolean;
    table_sizing_mode: string;
    table_toolbar: string;
    target_list: boolean;
    toolbar: string;
}

export class RichTextEditor extends React.Component<RichTextEditorProps, RichTextEditorState> {
    private editor: Editor | undefined;
    private readonly textAreaId: string;
    private readonly rteHiddenTextAreaId: string;
    private readonly defaultValue: string;
    private readonly showWordCount: boolean;
    private readonly cssPaths: string[];
    private readonly tools: string[];
    private readonly getWordCount: typeof getWordCount;
    private readonly plugins = [
        'advlist',
        'autolink',
        'lists',
        'link',
        'paste',
        'tabfocus',
        'help',
        'table',
        'code',
        'image',
    ];

    private readonly availableTools = [
        'formatselect',
        'bold italic underline superscript subscript',
        'bullist numlist outdent indent',
        'link',
        'image table',
        'code',
        'help',
    ];

    private readonly basicTools = {
        formatselect: true,
        bold: true,
        italic: true,
        bullist: true,
        numlist: true,
        outdent: true,
        indent: true,
        link: true,
        superscript: true,
        subscript: true,
        help: true,
    };

    private readonly enhancedTools = {
        ...this.basicTools,
        underline: true,
        table: true,
    };

    public constructor(props: RichTextEditorProps) {
        super(props);

        this.renderNoScript = this.renderNoScript.bind(this);
        this.updateWordCount = debounce(this.updateWordCount.bind(this), 250);
        this.renderWordCount = this.renderWordCount.bind(this);
        this.setupEditor = this.setupEditor.bind(this);
        this.onEditorCommand = this.onEditorCommand.bind(this);
        this.setContentClasses = this.setContentClasses.bind(this);
        this.setContentClassesForElement = this.setContentClassesForElement.bind(this);
        this.setContentElementClass = this.setContentElementClass.bind(this);
        this.setupTables = this.setupTables.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.setElementAttribute = this.setElementAttribute.bind(this);
        this.getWordCount = getWordCount;

        // setup private fields
        this.textAreaId = `${props.name}__rte-textarea`;
        this.rteHiddenTextAreaId = `${props.name}__rte_hidden`;
        this.defaultValue = props.defaultValue ?? '';
        // HTMLise plain text if necessary
        if (this.defaultValue && !this.defaultValue.includes('<')) {
            this.defaultValue =
                '<p class="govuk-body">' +
                this.defaultValue
                    .replace(/\r?\n/g, '<br/>')
                    .replace(/\t/g, '&nbsp;'.repeat(4))
                    .replace(/\s\s+/g, m => `${'&nbsp;'.repeat(m.length - 1)} `) +
                '</p>';
        }
        this.showWordCount =
            props.showWordCount === true || !!(props.showWordCount === undefined && props.wordCountAllowed);
        this.cssPaths = props.contentCssPaths ?? [];
        if (props.useCssFromNextJs !== false) {
            this.cssPaths.push('/_next/static/css/main.css');
        }

        let editorTools;

        // Merge the overrides with the required tools for the editor type
        switch (props.editorType) {
            case 'enhanced':
                editorTools = { ...this.enhancedTools, ...props.rteOverrides };
                break;
            default:
                editorTools = { ...this.basicTools, ...props.rteOverrides };
                break;
        }

        // Create a list of space separated tool names that are required
        const requiredTools = Object.entries(editorTools)
            .filter(([, required]) => required)
            .map(([tool]) => tool);

        this.tools = this.availableTools.map(section => {
            return section
                .split(' ')
                .filter(tool => requiredTools.includes(tool))
                .join(' ');
        });

        // setup state
        const wordCount = this.getWordCount(this.defaultValue, this.props.wordCountAllowed);
        this.state = { ...wordCount, content: this.defaultValue };
    }

    componentDidUpdate(prevProps: Readonly<RichTextEditorProps>, prevState: Readonly<RichTextEditorState>): void {
        if (prevState.content !== this.state.content) {
            this.onImageChange(this.state.content, prevState.content);
        }
    }

    protected onImageChange = (newContent: string, previousContent: string): void => {
        const findAppImages = new RegExp(/app-image-id="([A-Za-z0-9-]*)"/g);

        let prevAppImageIds: RegExpExecArray | null, newAppImageId;
        const newTitles = [];
        while ((newAppImageId = findAppImages.exec(newContent)) !== null) {
            newTitles.push(newAppImageId[1]);
        }
        while (null !== (prevAppImageIds = findAppImages.exec(previousContent))) {
            if (!newTitles.includes(prevAppImageIds[1])) {
                if (typeof this.props.setShowError === 'function') {
                    this.props.setShowError((prevErrors: ErrorFormatWithHiddenAndImageId[]) => {
                        return prevErrors.map(prevError => {
                            if (prevError.applicationImageId === prevAppImageIds![1]) {
                                return { ...prevError, hidden: true };
                            } else {
                                return prevError;
                            }
                        });
                    });
                }
            }
        }
    };

    private updateWordCount() {
        const html = this.editor!.getContent();
        const { wordCount, wordCountRemaining, isOverAllowedWordCount } = this.getWordCount(
            html,
            this.props.wordCountAllowed,
        );
        const prevWordCount = this.state.wordCount;

        this.setState({
            wordCount,
            wordCountRemaining,
            isOverAllowedWordCount,
        });
        if (wordCount !== prevWordCount && this.props.onWordCountChange) {
            this.props.onWordCountChange(wordCount, isOverAllowedWordCount);
        }
    }

    private renderWordCount(
        hintTextFn?: (wordCountRemaining: number, overWordCount: boolean) => string,
    ): React.ReactNode | void {
        if (!this.showWordCount) return;

        const { isOverAllowedWordCount, wordCountRemaining } = this.state;
        const { name } = this.props;

        const defaultHintTextFn = (wordCount: number, overWordCount: boolean) =>
            overWordCount
                ? `You are ${Math.abs(wordCount)} word${wordCount === -1 ? '' : 's'} over the limit`
                : `You have ${wordCount} word${wordCount === 1 ? '' : 's'} remaining`;

        const hintText = hintTextFn
            ? hintTextFn(wordCountRemaining, isOverAllowedWordCount)
            : defaultHintTextFn(wordCountRemaining, isOverAllowedWordCount);

        if (isOverAllowedWordCount) {
            return (
                <span id={`more-detail-info-${name}`} className="govuk-error-message" aria-live="polite">
                    {hintText}
                </span>
            );
        }

        return (
            <Hint id={'more-detail-info-' + name} aria-live="polite">
                {hintText}
            </Hint>
        );
    }

    private renderNoScript(): React.ReactNode {
        return (
            <noscript>
                <div className="alerts alerts--danger">
                    <strong>JavaScript is not enabled</strong> This means anything you enter or paste into the box below
                    will appear without formatting. To use &apos;rich text editing&apos; functions, you will need{' '}
                    <a
                        href="https://www.enable-javascript.com/"
                        className="govuk-link"
                        rel="noreferrer"
                        target="_blank"
                    >
                        to enable javascript
                    </a>{' '}
                    in your device or browser&apos;s security settings. If you did not disable javascript, try
                    refreshing this page in a few minutes.
                </div>
            </noscript>
        );
    }

    get init(): ReactEditorInitProps {
        const { disabled, showStatusBar, height, enablePasteDataImages, imagesUploadHandler, extendedValidElements } =
            this.props;

        // No matter what, we'll want to verify the type of image to make sure it's supported, then do any additional validation
        // that the provided upload handler wants to do (file size, etc.).  We have to do it this way because out of the
        // box, images_file_types restricts what types of images are accepted, but doesn't display any error message.
        const imagesUploadHandlerBase = (
            blobInfo: BlobInfo,
            success: (url: string) => void,
            failure: (err: string, options?: UploadFailureOptions | undefined) => void,
        ) => {
            const mimeType = blobInfo.blob().type;
            const validImageTypes = [
                'image/jpeg',
                'image/jpg',
                'image/jpe',
                'image/jfi',
                'image/jif',
                'image/jfif',
                'image/png',
                'image/gif',
                'image/bmp',
                'image/webp',
            ];
            if (!validImageTypes.includes(mimeType)) {
                failure(`${mimeType} is not a valid image format`);
                return;
            }

            // After the mimeType check, execute additional image handling code, if provided.
            if (imagesUploadHandler) {
                imagesUploadHandler(blobInfo, success, failure);
            }
        };

        return {
            a11y_advanced_options: false,
            a11ychecker_allow_decorative_images: true,
            advlist_bullet_styles: 'disc',
            advlist_number_styles: 'default',
            block_formats: 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3',
            branding: false,
            browser_spellcheck: true,
            content_css: this.cssPaths,
            content_style: `html { overflow-x: auto !important; } body { margin: 10px 15px; ${
                disabled && 'color: grey; background-color: rgba(239, 239, 239, 0.3);'
            }}`,
            contextmenu: false,
            convert_urls: false,
            default_link_target: '_self',
            extended_valid_elements: extendedValidElements,
            fixed_toolbar_container: '#my_div_for_toolbar',
            height: height ?? 500,
            help_tabs: ['shortcuts', 'keyboardnav'],
            hidden_input: false,
            image_advtab: false,
            image_description: true,
            image_dimensions: false,
            image_title: false,
            images_file_types: 'apng,avif,jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,svg,tiff',
            images_upload_handler: imagesUploadHandlerBase,
            link_assume_external_targets: true,
            link_context_toolbar: false,
            link_title: false,
            menubar: false,
            paste_data_images: enablePasteDataImages,
            plugins: this.plugins.join(' '),
            resize: true,
            setup: this.setupEditor,
            statusbar: !!showStatusBar,
            style_formats_merge: false,
            tabfocus_elements: ':prev,:next',
            table_advtab: false,
            table_appearance_options: false,
            table_cell_advtab: false,
            table_column_resizing: 'preservetable',
            table_row_advtab: false,
            table_sizing_mode: 'relative',
            table_toolbar:
                'tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tabledelete',
            target_list: false,
            toolbar: this.tools.join(' | '),
        };
    }

    render(): React.ReactNode {
        const { className, isError, disabled, name, rows, validation, tinymceScriptSrc, hintTextFn } = this.props;

        const multiValidation = multiValidationTypes({ validationResult: validation, isError: isError });
        const classNames: string[] = [];
        if (className) {
            classNames.push(className);
        }
        if (!multiValidation.isValid && multiValidation.showError) {
            classNames.push('govuk-input--error');
        }

        return (
            <>
                <a id={name} />
                {this.renderNoScript()}
                <div className={classNames && classNames.join(' ')}>
                    {this.props.textareaLabel && (
                        <Label className="govuk-visually-hidden" htmlFor={this.textAreaId}>
                            {this.props.textareaLabel}
                        </Label>
                    )}
                    <textarea
                        name={name}
                        id={this.textAreaId}
                        rows={rows ?? 8}
                        defaultValue={this.defaultValue}
                        className={cx([`govuk-textarea`, 'rte-textarea'])}
                        disabled={!!disabled}
                    />
                    <ReactEditor
                        tinymceScriptSrc={tinymceScriptSrc ?? '/tinymce/tinymce.min.js'}
                        id={this.rteHiddenTextAreaId}
                        apiKey="8d9yznc3w9xja0ae3p2y0toy9cbjkd1b54cex0jlw0viw9rk"
                        initialValue={this.defaultValue}
                        init={this.init}
                        disabled={!!disabled}
                        onChange={this.handleEditorChange}
                    />
                </div>
                {this.renderWordCount(hintTextFn)}
            </>
        );
    }

    private setupEditor(activeEditor: Editor) {
        this.editor = activeEditor;
        const { name, title } = this.props;
        activeEditor.on('blur', () => {
            activeEditor.dom.select('p').forEach((p, i) => {
                const node = document.createElement('p');
                node.innerHTML = p.innerHTML.replace(
                    /^\s*(<\w+[^>]*>)?(?:&nbsp;|\s)*([\w\W]*?)(?:&nbsp;|\s)*(<\/\w+>)?\s*$/gi,
                    '$1$2$3',
                );
                Array.from(p.attributes).forEach(attr => node.setAttribute(attr.name, attr.value));
                activeEditor.dom.select('p')[i].replaceWith(node);
            });
        });
        activeEditor.on('init', () => {
            this.setupTables();
            this.setContentClasses('all');
            this.updateWordCount();
            if (title) {
                const iframe = document.getElementById(`${name}__rte_hidden_ifr`);
                const existingTitle = iframe?.getAttribute('title');
                iframe?.setAttribute('title', `${title} ${existingTitle}`);
            }
        });
        activeEditor.on('input', () => {
            this.updateWordCount();

            const content = this.editor!.getContent();
            (document.getElementById(this.textAreaId) as HTMLInputElement).value = content;

            if (this.props.onChange) {
                this.props.onChange((document.getElementById(this.textAreaId) as HTMLInputElement).value);
            }
        });
        activeEditor.on('NewBlock', () => {
            this.setupTables();
            this.setContentClasses('typography');
        });
        activeEditor.on('Change', () => {
            this.setContentClasses('all');
        });

        activeEditor.on('NodeChange', e => {
            const content = activeEditor.getContent();
            this.setState({ content: content });

            const images = e.element.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
                if (typeof this.props.setShowError === 'function') {
                    const appImageId: string = images[i].getAttribute('app-image-id') || '';

                    this.props.setShowError(showError => {
                        return showError.map(er => {
                            if (er.applicationImageId === appImageId) {
                                return { ...er, hidden: false };
                            } else {
                                return er;
                            }
                        });
                    });
                }
            }
        });

        activeEditor.on('ExecCommand', ({ command }) => {
            this.onEditorCommand(command);
            this.updateWordCount();
        });
        if (!(this.props.editorType === 'enhanced')) {
            activeEditor.addCommand('Underline', () => {
                // Disable underline shortcut
            });
        }
        activeEditor.on('OpenWindow', _ => {
            if (
                (document.getElementsByClassName('tox-dialog__title')[0] as HTMLElement).innerText ===
                'Insert/Edit Image'
            ) {
                const tabs = document.getElementsByClassName('tox-dialog__body-nav-item tox-tab');

                const generalTab = tabs[0] as HTMLElement;
                const uploadTab = tabs[1] as HTMLElement;

                const img = activeEditor.selection.getNode();

                const isNewImage = !(img as HTMLImageElement).src;

                if (isNewImage) {
                    // hide the general tab when uploading a new image
                    uploadTab.click();
                    generalTab.style.display = 'none';
                } else {
                    // hide the upload tab when uploading a new image, as replacement causes issues due to existing app-image-id attributes
                    uploadTab.style.display = 'none';
                }

                const tabContainer = uploadTab.closest('.tox-dialog')?.querySelector('.tox-dialog__body-content');
                tabContainer?.setAttribute('data-tfs-source-container', 'true');
            }
        });
    }

    private handleEditorChange(_: EditorEvent<unknown>, editor: Editor) {
        const content = editor.getContent();
        (document.getElementById(this.textAreaId) as HTMLInputElement).value = content;
        this.updateWordCount();
    }

    private onEditorCommand(command: string) {
        if (commandMap.has(command)) {
            const elementType: string[] = commandMap.get(command)!;
            for (const type of elementType) {
                this.setContentClasses(type);
            }
        }
    }

    private setContentClasses(elementType: string) {
        if (elementType === 'all') {
            classMap.forEach((_: Map<string, string>, subElementType: string) => {
                this.setContentClassesForElement(subElementType);
            });
        } else {
            this.setContentClassesForElement(elementType);
        }
    }

    private setContentClassesForElement(elementType: string) {
        classMap.get(elementType)?.forEach((value: string, element: string) => {
            this.setContentElementClass(element, value);
        });
    }

    private setContentElementClass(element: string, className: string) {
        this.setElementAttribute(element, 'class', className);
    }

    private setupTables() {
        this.setElementAttribute('table', 'border', '1');
    }

    private setElementAttribute(element: string, attributeName: string, value: string) {
        // the typescript defs for setAttribute are incorrect, hence requiring ts-ignore
        // using setTimeout to shift the update after any current event which fixes an issue with cell width calculation
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setTimeout(() => {
            this.editor!.dom.setAttrib(this.editor!.dom.select(element), attributeName, value);
        }, 0);
    }
}

const classMap = new Map([
    // classes for elements, grouped by element type
    [
        'typography',
        new Map([
            ['p', 'govuk-body'],
            ['h1', 'govuk-heading-l'],
            ['h2', 'govuk-heading-m'],
            ['h3', 'govuk-heading-s'],
        ]),
    ],
    [
        'list',
        new Map([
            ['ul', 'govuk-list govuk-list--bullet'],
            ['ol', 'govuk-list govuk-list--number'],
        ]),
    ],
    ['link', new Map([['a', 'govuk-link']])],
    [
        'table',
        new Map([
            ['table', 'govuk-table responsive-table'],
            ['caption', 'govuk-table__caption'],
            ['thead', 'govuk-table__head'],
            ['tr', 'govuk-table__row'],
            ['th', 'govuk-table__header'],
            ['tbody', 'govuk-table__body'],
            ['td', 'govuk-table__cell'],
        ]),
    ],
]);

const commandMap = new Map([
    // maps editor commands to the element types they affect
    ['InsertUnorderedList', ['list', 'typography']],
    ['InsertOrderedList', ['list', 'typography']],
    ['indent', ['list', 'typography']],
    ['outdent', ['list', 'typography']],
    ['mceInsertContent', ['all']],
    ['mceInsertClipboardContent', ['all']],
    ['mceToggleFormat', ['typography']],
    ['mceInsertLink', ['link']],
    ['mceTableSplitCells', ['table']],
    ['mceTableMergeCells', ['table']],
    ['mceTableInsertRowBefore', ['table']],
    ['mceTableInsertRowAfter', ['table']],
    ['mceTableInsertColBefore', ['table']],
    ['mceTableInsertColAfter', ['table']],
    ['mceTablePasteRowBefore', ['table']],
    ['mceTablePasteRowAfter', ['table']],
    ['mceTablePasteColBefore', ['table']],
    ['mceTablePasteColAfter', ['table']],
]);
