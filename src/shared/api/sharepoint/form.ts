import { sp } from './base';
import type { FieldSettings, FormItem, SPField } from './models';
import { QUERY_ROW_LIMIT } from 'shared/config';
import { lists } from './const';

export const defaultValuesByType = {
    Lookup: null,
    DateTime: null,
    User: null,
    Choice: null,
    Radio: null,
    Text: '',
};

const getFormFieldsSettings = (): Promise<FieldSettings[]> => {
    return sp.web
        .getList(lists.settings)
        .items.select(
            'Id',
            'Title',
            'position',
            'group',
            'group/Title',
            'group/position',
            'group/Id'
        )
        .expand('group')
        .top(QUERY_ROW_LIMIT)();
};

const getSpFields = async (): Promise<SPField[]> => {
    const includeFields = ['ID', 'Title'];
    const filter = `CanBeDeleted eq true or (${includeFields
        .map(field => `Title eq '${field}'`)
        .join(' or ')})`;
    return await sp.web
        .getList(lists.checkLists)
        .fields.select(
            'Id',
            'Title',
            'InternalName',
            'TypeAsString',
            'Required',
            'Choices',
            'LookupField',
            'LookupList',
            'EditFormat'
        )
        .filter(filter)();
};

const getOptionsForLookup = async (lookupFields: Array<Required<SPField>>) => {
    return await Promise.all(
        lookupFields.map(async field => {
            return {
                name: field.InternalName,
                options: await sp.web.lists
                    .getById(field.LookupList)
                    .items.select('Id', field.LookupField)()
                    .then((res: { Id: number; Title: string }[]) =>
                        res.map(({ Id, Title }) => ({
                            value: Id,
                            text: Title,
                        }))
                    ),
            };
        })
    );
};

export const getFormItems = async (): Promise<FormItem[]> => {
    const fieldsSettings = await getFormFieldsSettings();
    const spFields = await getSpFields();

    const lookupFields = spFields.filter(
        spField => spField.TypeAsString === 'Lookup'
    ) as Array<Required<SPField>>;

    const lookupOptionsByField = await getOptionsForLookup(lookupFields);

    return spFields
        .map(spField => {
            const fieldsSetting = fieldsSettings.find(
                setting => setting.Title === spField.InternalName
            );

            const lookUpOptions = lookupOptionsByField.find(
                item => item.name === spField.InternalName
            );

            const name =
                spField.TypeAsString === 'Lookup' ||
                spField.TypeAsString === 'User'
                    ? spField.InternalName + 'Id'
                    : spField.InternalName;

            return {
                id: spField.Id,
                title: spField.Title,
                name,
                type:
                    spField?.EditFormat === 1 ? 'Radio' : spField.TypeAsString,
                options: spField.Choices?.map(v => ({ text: v, value: v })),
                required: spField.Required,
                position: fieldsSetting!.position,
                group: fieldsSetting!.group,
                defaultValue: defaultValuesByType[spField.TypeAsString],
                lookUpOptions: lookUpOptions?.options || null,
            };
        })
        .sort((a, b) => a.position - b.position)
        .sort((a, b) => a.group.position - b.group.position);
};

export type GroupedFormItem = {
    id: number;
    groupTitle: string;
    position: number;
    fields: FormItem[];
};

export const groupFormItemsByCategory = (items: FormItem[]) => {
    const fieldGroupMap = items.reduce((acc, { group, ...rest }) => {
        const groupElement = acc.get(group.Id) || {
            id: group.Id,
            groupTitle: group.Title,
            position: group.position,
            fields: [],
        };
        groupElement.fields.push({ ...rest, group });
        return acc.set(group.Id, groupElement);
    }, new Map<number, GroupedFormItem>());

    return [...fieldGroupMap.values()];
};
