import { storiesOf } from '@storybook/react';
import { TfsPanelItem } from '../components/panelItem';
import cx from 'classnames';
import React from 'react';

import '../styles.scss';
import { text, boolean } from '@storybook/addon-knobs';
import { CustomPanelGroup } from '../components/customPanelGroup';
import { MetadataItem, MetadataItems } from '../components/metadataItems';
import { Colour } from '../components/tag';

const stories = storiesOf('Components', module);

stories.add('Tfs Panel Item on its own', () => {
    const completionStatusProvided = boolean('Completion status provided', true);
    const comp = !!completionStatusProvided
        ? {
              isComplete: boolean('Is complete', true),
              showStatusIcon: boolean('Show status icon', true),
              showStatusText: boolean('Show status text', true),
          }
        : undefined;

    const openDateStyle = completionStatusProvided && comp && comp.isComplete ? 'item-successful' : '';
    const closedDateStyle = completionStatusProvided && comp && comp.isComplete ? 'item-successful' : '';
    const metadata = (
        <React.Fragment>
            <span data-name="open-date" className={openDateStyle}>
                Opening date:
                <br />
                <strong>11 August 2020</strong>
                <br />
            </span>
            <span data-name="close-date" className={closedDateStyle}>
                Closing date:
                <br />
                <strong>10 September 2030</strong>
                <br />
            </span>
        </React.Fragment>
    );

    const tagTitle = text('Tag title', '');
    const tagBackgroundColor = text('Tag backgroundColor', 'BLUE');
    const tagUseSolidBackgroundColor = boolean('Tag use solid backgroundColor', false);

    return (
        <TfsPanelItem
            isComplete={completionStatusProvided && comp && comp.isComplete}
            showStatusIcon={completionStatusProvided && comp && comp.showStatusIcon}
            showStatusText={completionStatusProvided && comp && comp.showStatusText}
            leftPanel={<span data-name="heading">Applications</span>}
            metadata={metadata}
            elementId="workflow-item-5"
            tagTitle={tagTitle}
            tagBackgroundColor={tagBackgroundColor as Colour}
            tagUseSolidBackgroundColor={tagUseSolidBackgroundColor}
        />
    );
});

stories.add('Panel Item with status data', () => {
    const title = text('Panel Title', 'Funders');
    const control = boolean('Has control', true) ? (
        <a href={'#'} className="govuk-link">
            Remove
        </a>
    ) : undefined;
    const metadata = boolean('Has metadata', true) ? text('Metadata', 'AHRC, ESRC, Innovate UK') : undefined;
    const panelItem = boolean('Title is link', true) ? (
        <a href="#">{title}</a>
    ) : (
        <React.Fragment>{title}</React.Fragment>
    );
    const errorText = text('Error message text', '');
    const error = !!errorText
        ? {
              text: errorText,
              fieldName: text('Error field name', 'Field name'),
          }
        : undefined;

    const completionStatusProvided = boolean('Completion status provided', true);
    const comp = !!completionStatusProvided
        ? {
              isComplete: boolean('Is complete', true),
              showStatusIcon: boolean('Show status icon', true),
              showStatusText: boolean('Show status text', true),
          }
        : undefined;

    const skinny = boolean('Is skinny', true);
    const lastItem = boolean('Is last item in application-items panel group', true);
    const tagTitle = text('Tag title', '');
    const tagBackgroundColor = text('Tag backgroundColor', 'BLUE');
    const tagUseSolidBackgroundColor = boolean('Tag use solid backgroundColor', false);

    return (
        <TfsPanelItem
            isComplete={completionStatusProvided && comp && comp.isComplete}
            showStatusIcon={completionStatusProvided && comp && comp.showStatusIcon}
            showStatusText={completionStatusProvided && comp && comp.showStatusText}
            metadata={metadata}
            control={control}
            leftPanel={panelItem}
            error={error}
            skinny={skinny}
            lastItem={lastItem}
            tagTitle={tagTitle}
            tagBackgroundColor={tagBackgroundColor as Colour}
            tagUseSolidBackgroundColor={tagUseSolidBackgroundColor}
        />
    );
});

stories.add('Panel Item with status data and tag', () => {
    const title = text('Panel Title', 'Funders');
    const control = boolean('Has control', false) ? (
        <a href={'#'} className="govuk-link">
            Remove
        </a>
    ) : undefined;
    const metadata = boolean('Has metadata', false) ? text('Metadata', 'AHRC, ESRC, Innovate UK') : undefined;
    const panelItem = boolean('Title is link', true) ? (
        <a href="#">{title}</a>
    ) : (
        <React.Fragment>{title}</React.Fragment>
    );
    const errorText = text('Error message text', '');
    const error = !!errorText
        ? {
              text: errorText,
              fieldName: text('Error field name', 'Field name'),
          }
        : undefined;

    const completionStatusProvided = boolean('Completion status provided', true);
    const comp = !!completionStatusProvided
        ? {
              isComplete: boolean('Is complete', true),
              showStatusIcon: boolean('Show status icon', true),
              showStatusText: boolean('Show status text', true),
          }
        : undefined;

    const skinny = boolean('Is skinny', false);
    const lastItem = boolean('Is last item in application-items panel group', true);

    const tagTitle = text('Tag title', 'Updated');
    const tagBackgroundColor = text('Tag backgroundColor', 'BLUE');
    const tagUseSolidBackgroundColor = boolean('Tag use solid backgroundColor', false);

    return (
        <TfsPanelItem
            isComplete={completionStatusProvided && comp && comp.isComplete}
            showStatusIcon={completionStatusProvided && comp && comp.showStatusIcon}
            showStatusText={completionStatusProvided && comp && comp.showStatusText}
            metadata={metadata}
            control={control}
            leftPanel={panelItem}
            error={error}
            skinny={skinny}
            lastItem={lastItem}
            tagTitle={tagTitle}
            tagBackgroundColor={tagBackgroundColor as Colour}
            tagUseSolidBackgroundColor={tagUseSolidBackgroundColor}
        />
    );
});

stories.add('Panel Group skinny with Tfs Panel Item', () => {
    const title = text('Panel Title', 'Funders');
    const control = boolean('Has control', true) ? (
        <a href={'#'} className="govuk-link">
            Remove
        </a>
    ) : undefined;
    const metadata = boolean('Has metadata', true) ? text('Metadata', 'AHRC, ESRC, Innovate UK') : undefined;
    const panelItem = boolean('Title is link', true) ? (
        <a href="#">{title}</a>
    ) : (
        <React.Fragment>{title}</React.Fragment>
    );
    const errorText = text('Error message text', '');
    const error = !!errorText
        ? {
              text: errorText,
              fieldName: text('Error field name', 'Field name'),
          }
        : undefined;

    const completionStatusProvided = boolean('Completion status provided', true);
    const comp = !!completionStatusProvided
        ? {
              isComplete: boolean('Is complete', true),
              showStatusIcon: boolean('Show status icon', true),
              showStatusText: boolean('Show status text', true),
          }
        : undefined;

    const skinny = boolean('Is skinny', true);
    const lastItem = boolean('Is last item in application-items panel group', true);

    const tagTitle = text('Tag title', '');
    const tagBackgroundColor = text('Tag backgroundColor', 'BLUE');
    const tagUseSolidBackgroundColor = boolean('Tag use solid backgroundColor', false);

    return (
        <CustomPanelGroup columnClassName={cx('application-items', 'u-space-b30')}>
            <TfsPanelItem
                isComplete={completionStatusProvided && comp && comp.isComplete}
                showStatusIcon={completionStatusProvided && comp && comp.showStatusIcon}
                showStatusText={completionStatusProvided && comp && comp.showStatusText}
                metadata={metadata}
                control={control}
                leftPanel={panelItem}
                error={error}
                skinny={skinny}
                lastItem={lastItem}
                tagTitle={tagTitle}
                tagBackgroundColor={tagBackgroundColor as Colour}
                tagUseSolidBackgroundColor={tagUseSolidBackgroundColor}
            />
        </CustomPanelGroup>
    );
});

stories.add('Panel Item with metadata', () => {
    const title = text('Panel Title', 'Funders');
    const metadata = text('Metadata', 'AHRC, ESRC, Innovate UK');
    const leftPanelItem = (
        <React.Fragment>
            <a href="#">{title}</a>
            <MetadataItems>
                <MetadataItem id="foo1" description="Started" value="1341" />
                <MetadataItem id="foo2" description="Over 50% complete" value="34" />
                <MetadataItem id="foo3" description="Submitted" value="6" />
                <MetadataItem id="foo4" description="Total" value="1381" />
            </MetadataItems>
        </React.Fragment>
    );

    const tagTitle = text('Tag title', '');
    const tagBackgroundColor = text('Tag backgroundColor', 'BLUE');
    const tagUseSolidBackgroundColor = boolean('Tag use solid backgroundColor', false);

    const skinny = boolean('Is skinny', true);

    return (
        <TfsPanelItem
            metadata={metadata}
            leftPanel={leftPanelItem}
            skinny={skinny}
            tagTitle={tagTitle}
            tagBackgroundColor={tagBackgroundColor as Colour}
            tagUseSolidBackgroundColor={tagUseSolidBackgroundColor}
        />
    );
});

stories.add('Panel Item, full width left panel with metadata', () => {
    const title = text('Panel Title', 'Funders');
    const metadata = text('Metadata', 'AHRC, ESRC, Innovate UK');
    const leftPanelItem = (
        <React.Fragment>
            <a href="#">{title}</a>
            <MetadataItems>
                <MetadataItem id="foo1" description="Started" value="1341" />
                <MetadataItem id="foo2" description="Over 50% complete" value="34" />
                <MetadataItem id="foo3" description="Submitted" value="6" />
                <MetadataItem id="foo4" description="Total" value="1381" />
            </MetadataItems>
        </React.Fragment>
    );

    const tagTitle = text('Tag title', '');
    const tagBackgroundColor = text('Tag backgroundColor', 'BLUE');
    const tagUseSolidBackgroundColor = boolean('Tag use solid backgroundColor', false);

    const skinny = boolean('Is skinny', true);

    return (
        <TfsPanelItem
            metadata={metadata}
            leftPanel={leftPanelItem}
            leftPanelFillsWidth={true}
            skinny={skinny}
            tagTitle={tagTitle}
            tagBackgroundColor={tagBackgroundColor as Colour}
            tagUseSolidBackgroundColor={tagUseSolidBackgroundColor}
        />
    );
});
