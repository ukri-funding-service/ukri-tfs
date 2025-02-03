declare module 'govuk-react-jsx' {
    export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        mainId: string;
        items: React.ReactNodeArray;
    }

    // We don't use the extended functionality of this component
    // within the GovUK React JSX lib which supports additional ReactRouter Link attributes
    export interface BackLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
        href?: string;
    }

    export interface BooleanItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
        hint?: HintProps;
        conditional?: { children: React.ReactNode };
        divider?: string;
    }

    export interface BooleanProps extends React.HTMLAttributes<HTMLDivElement> {
        controlType?: 'radios' | 'checkboxes';
        idPrefix?: string;
        name?: string;
        fieldset?: FieldsetProps;
        formGroup?: FormGroupProps;
        hint?: HintProps;
        errorMessage?: ErrorMessageProps;
        items?: BooleanItemProps[];
        disabled?: boolean;
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
        onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    }

    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
        element?: 'button' | 'a' | 'input';
        href?: string;
        isStartButton?: boolean;
        preventDoubleClick?: boolean;
        // Incomplete
    }

    export type CheckboxesProps = Omit<BooleanProps, 'controlType'>;

    export type CheckboxesItemProps = BooleanItemProps;

    export interface DateInputItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label?: string;
        disabled?: boolean;
    }

    export interface DateInputProps extends React.HTMLAttributes<HTMLDivElement> {
        errorMessage?: ErrorMessageProps;
        fieldset?: FieldsetProps;
        hint?: HintProps;
        items?: DateInputItemProps[];
        name?: string;
        disabled?: boolean;
        namePrefix?: string;
    }

    export interface DetailsProps extends React.HTMLAttributes<HTMLDivElement> {
        summaryChildren?: string;
        className?: string;
        children: React.ReactNode;
    }

    export interface ErrorMessageProps extends React.HTMLAttributes<HTMLSpanElement> {
        visuallyHiddenText?: string | boolean;
    }

    export interface ErrorSummaryChild {
        children: string;
        href?: string;
    }

    export interface ErrorSummaryProps {
        errorList: ErrorSummaryChild[];
        titleChildren: string;
    }

    export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
        legend: LegendProps;
    }

    export interface FooterProps {
        className?: string;
        containerClassName?: string;
        meta?: string;
        navigation?: string;
    }

    export interface FormGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
        className: string;
    }

    export interface HeaderLink {
        id: string;
        text: string;
        url?: string; // No url means will be used as a sector break on mobile views
        currentlySelected?: boolean;
        isActive: boolean;
        navType: 'TOP' | 'USER' | 'ORGANISATION';
    }

    export interface HeaderProps {
        className?: string;
        containerClassName?: string;
        homepageUrlHref?: string;
        homepageUrlTo?: string;
        navigation?: string;
        navigationClassName?: string;
        productName?: string;
        serviceName?: string;
        serviceUrlHref?: string;
        serviceUrlTo?: string;
        navigationLabel?: string;
        menuButtonLabel?: string;
    }

    export type HintProps = React.HTMLAttributes<HTMLDivElement>;

    export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
        prefix?: {
            children: React.ReactChild;
        };
        suffix?: {
            children: React.ReactChild;
        };
        formGroup?:
            | string
            | {
                  className: string;
              };
        hint?: HintProps | string | React.ReactChild | { children: string | React.ReactChild[] }; // ???
        errorMessage?: {
            children: string | string[];
        } | null;
        label?:
            | string
            | {
                  id?: string;
                  children: string | React.ReactChild | React.ReactChild[];
                  className?: string | string[];
              };
        describedBy?: string | undefined;
        disable?: boolean;
    }

    export interface InsetTextProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
        children?: string | React.ReactChild | React.ReactChild[];
        titleId?: string; // this doesn't seem to exist on the govuk-react-jsx element, required to make our code typesafe
    }

    export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

    export interface LegendProps extends React.HTMLAttributes<HTMLLegendElement> {
        isPageHeading?: boolean;
    }

    export interface NotificationBannerProps {
        titleId: string;
        type?: 'success' | undefined;
        disableAutoFocus?: boolean;
        role?: string;
        titleChildren?: string;
        titleHeadingLevel?: '1' | '2' | '3' | '4' | '5' | '6';
        children?: React.ReactNode;
        className?: string;
    }

    export type RadiosItemProps = BooleanItemProps;

    export type RadiosProps = Omit<BooleanProps, 'controlType'>;

    export interface SelectOptionProps extends React.HTMLAttributes<HTMLOptionElement> {
        value?: string | number;
    }

    export interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
        label?: LabelProps;
        hint?: HintProps;
        name?: string;
        items?: SelectOptionProps[];
        formGroup?: React.HTMLAttributes<HTMLFieldSetElement>;
        errorMessage?: ErrorMessageProps;
    }

    export type SkipLinkProps = React.ReactHTMLAttributes<HTMLAnchorElement>;

    export interface SummaryListProps extends React.HtmlHTMLAttributes<HTMLElement> {
        rows: React.ReactNodeArray;
    }

    export interface TableCell {
        class?: string;
        children?: React.ReactNode;
    }

    export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
        caption?: string;
        captionClassName?: string;
        className?: string;
        firstCellIsHeader?: boolean;
        head?: React.ReactNode[];
        rows: TableRow[];
    }

    export interface TableRow {
        cells: TableCell[];
    }

    export interface TagProps extends React.HtmlHTMLAttributes<HTMLElement> {
        children?: React.ReactChild;
        className?: string;
    }

    export interface TemplateProps {
        children: (React.ReactChild | React.ReactChild[] | Element | undefined)[];
        title?: string;
        skipLink?: React.ReactHTMLElement<HTMLLinkElement>;
        header: HeaderProps;
        footer?: FooterProps;
        beforeContent?: React.ReactChild;
        mainLang?: string;
        containerClassName?: string;
        mainClassName?: string;
        themeColor?: string | number;
    }

    export interface TextareaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
        label?: LabelProps;
        hint?: HintProps;
        errorMessage?: ErrorMessageProps;
        name: string;
        rows: number;
        disabled?: boolean;
    }

    export interface WarningTextProps extends React.HTMLAttributes<HTMLDivElement> {
        iconFallbackText?: string;
    }

    // Unknown here indicates uncertainty over the appropriate types.
    // These should be replaced with actual types where possible.
    export type AccordionType = React.FC<AccordionProps>;
    export const Accordion: AccordionType;

    export type BackLinkType = React.FC<BackLinkProps>;
    export const BackLink: BackLinkType;

    export type BooleanType = React.FC<BooleanProps>;
    export const Boolean: BooleanType;

    export type ButtonType = React.FC<ButtonProps>;
    export const Button: ButtonType;

    export type CheckboxesType = React.FC<CheckboxesProps>;
    export const Checkboxes: CheckboxesType;

    export type DateInputType = React.FC<DateInputProps>;
    export const DateInput: DateInputType;

    export type DetailsType = React.FC<DetailsProps>;
    export const Details: DetailsType;

    export type ErrorSummaryType = React.FC<ErrorSummaryProps>;
    export const ErrorSummary: ErrorSummaryType;

    export type ErrorMessageType = React.FC<ErrorMessageProps>;
    export const ErrorMessage: ErrorMessageType;

    export type FieldsetType = React.FC<FieldsetProps>;
    export const Fieldset: FieldsetType;

    export type HintType = React.FC<HintProps>;
    export const Hint: HintType;

    export type InputType = React.FC<InputProps>;
    export const Input: InputType;

    export type InsetTextType = React.FC<InsetTextProps>;
    export const InsetText: InsetTextType;

    export type LabelType = React.FC<LabelProps>;
    export const Label: LabelType;

    export type NotificationBannerType = React.FC<NotificationBannerProps>;
    export const NotificationBanner: NotificationBannerType;

    export type RadiosType = React.FC<RadiosProps>;
    export const Radios: RadiosType;

    export type SelectType = React.FC<SelectProps>;
    export const Select: SelectType;

    export type SkipLinkType = React.FC<SkipLinkProps>;
    export const SkipLink: SkipLinkType;

    export type SummaryListType = React.FC<SummaryListProps>;
    export const SummaryList: SummaryListType;

    export type TableType = React.FC<TableProps>;
    export const Table: TableType;

    export type TabsType = React.FC<unknown>;
    export const Tabs: TabsType;

    export type TagType = React.FC<TagProps>;
    export const Tag: TagType;

    export type TemplateType = React.FC<TemplateProps>;
    export const Template: TemplateType;

    export type TextareaType = React.FC<TextareaProps>;
    export const Textarea: TextareaType;

    export type WarningTextType = React.FC<WarningTextProps>;
    export const WarningText: WarningTextType;
}
