import { sp } from './base';
import { QUERY_ROW_LIMIT } from 'shared/config';
import type { Survey, FormItem } from './models';
import { getFormItems, groupFormItemsByCategory } from './form';
import { utils, WorkSheet, writeFileXLSX } from 'xlsx';
import { callAddFont, jsPDF } from 'shared/lib/jsPDF';
import autoTable, { RowInput } from 'jspdf-autotable';
import { checkListType, lists } from './const';

export type UpdateSurveysParams = {
    surveyId: number;
    fields: FormItem[];
    properties: Record<string, any>;
};

export type CreateSurveysParams = {
    fields: FormItem[];
    properties: Record<string, any>;
};

export type ExportSurveysParams = {
    fields: FormItem[];
    ids: number[];
};

export type PDFSurveysParams = {
    fields: FormItem[];
    id: number;
};

export const getSurveysList = async (): Promise<Survey[]> => {
    return await sp.web
        .getList(lists.checkLists)
        .items.select('*')
        .top(QUERY_ROW_LIMIT)()
        .then(res => res.map(item => ({ ...item, checked: false })));
};

const getUserById = async (id: number) => {
    return await sp.web.getUserById(id)();
};

const getFieldsWithTypeUser = (survey: any, fields: FormItem[]) => {
    return fields
        .filter(field => field.type === 'User' && survey[field.name] !== null)
        .map(field => ({ name: field.name, value: survey[field.name] }));
};

export const getSurveyById = async (id: number): Promise<Survey> => {
    const fields = await getFormItems();

    const survey: any = await sp.web
        .getList(lists.checkLists)
        .items.getById(id)
        .select('*')();

    const fieldsWithTypeUser = getFieldsWithTypeUser(survey, fields);

    const unwrappedUsers = await Promise.all(
        fieldsWithTypeUser.map(async field => {
            return [
                field.name,
                await getUserById(field.value).then(user => ({
                    id: user.LoginName,
                    title: user.Title,
                })),
            ];
        })
    ).then(result => Object.fromEntries(result));

    const data = Object.fromEntries(
        fields.map(field => {
            if (field.type === 'User') {
                return [field.name, unwrappedUsers[field.name]];
            }

            if (field.type === 'Choice' || field.type === 'Lookup') {
                return [field.name, survey[field.name] || null];
            }

            if (field.type === 'Text') {
                return [field.name, survey[field.name] || ''];
            }

            return [field.name, survey[field.name]];
        })
    );

    return {
        Id: survey.Id,
        Title: survey.Title,
        data,
        checked: false,
    };
};

export const updateSurveyById = async (data: UpdateSurveysParams) => {
    const { surveyId, fields, properties } = data;

    const fieldsWithTypeUser = getFieldsWithTypeUser(properties, fields);

    const unwrappedUsers = await Promise.all(
        fieldsWithTypeUser.map(async field => {
            return [
                field.name,
                await sp.web
                    .ensureUser(field.value.id)
                    .then(user => user.data.Id),
            ];
        })
    ).then(result => Object.fromEntries(result));

    const survey: any = await sp.web
        .getList(lists.checkLists)
        .items.getById(surveyId)
        .update({ ...properties, ...unwrappedUsers });

    return {
        Id: survey.Id,
        Title: survey.Title,
        data,
        checked: false,
    };
};

export const createSurvey = async (data: CreateSurveysParams) => {
    const { fields, properties } = data;

    const fieldsWithTypeUser = getFieldsWithTypeUser(properties, fields);

    const unwrappedUsers = await Promise.all(
        fieldsWithTypeUser.map(async field => {
            return [
                field.name,
                await sp.web
                    .ensureUser(field.value.id)
                    .then(user => user.data.Id),
            ];
        })
    ).then(result => Object.fromEntries(result));

    const objectTitle = fields
        .find(field => field.name === 'objectTitlesId')
        ?.lookUpOptions?.find(
            option => option.value === properties.objectTitlesId
        )?.text;

    const monitoringZone = fields
        .find(field => field.name === 'monitoringZoneId')
        ?.lookUpOptions?.find(
            option => option.value === properties.monitoringZoneId
        )?.text;

    const survey: any = await sp.web.getList(lists.checkLists).items.add({
        Title: `${objectTitle} / ${(
            properties.monitoringDate as Date
        ).toLocaleDateString('ru')} / ${monitoringZone}`,
        ...properties,
        ...unwrappedUsers,
    });

    return {
        Id: survey.Id,
        Title: survey.Title,
        data,
        checked: false,
    };
};

export const deleteSurveyItemsBatch = async (ids: number[]) => {
    const [batchedSP, execute] = sp.batched();

    const list = batchedSP.web.getList(lists.checkLists);

    ids.map(id => list.items.getById(id).recycle());

    await execute();
};

export const exportSurveyItems = async (data: ExportSurveysParams) => {
    const { fields, ids } = data;

    const selectedFields = fields.map(field =>
        field.type === 'Lookup' || field.type === 'User'
            ? `${field.name.replace('Id', '')}/Title`
            : field.name
    );

    const expandedFields = fields
        .filter(field => field.type === 'Lookup' || field.type === 'User')
        .map(field => field.name.replace('Id', ''));

    const list = await sp.web
        .getList(lists.checkLists)
        .items.select('Id', ...selectedFields)
        .expand(...expandedFields)
        .getAll()
        .then(res => res.filter(item => ids.indexOf(item.Id) !== -1))
        .then(res =>
            res.map(item =>
                Object.fromEntries(
                    fields.map(({ name, type }) => {
                        if (type === 'Lookup' || type === 'User') {
                            const fieldName = name.replace('Id', '');
                            const value = item[fieldName]?.Title;
                            return [fieldName, value];
                        }

                        if (type === 'DateTime') {
                            const value = new Date(
                                item[name]
                            ).toLocaleDateString('ru');

                            return [name, value];
                        }

                        return [name, item[name]];
                    })
                )
            )
        );

    const heading = [fields.map(field => field.title)];

    const wb = utils.book_new();

    const ws: WorkSheet = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, heading);
    utils.sheet_add_json(ws, list, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'Data');
    ws['!autofilter'] = { ref: 'A1:AG1' };

    const minWidth = 12;

    const howManyColumns = heading.reduce((prev, curr) => {
        return curr.length > prev ? curr.length : prev;
    }, 0);

    let currentWidht = minWidth;
    const worksheetCols = [];

    for (const index in Array.from({ length: howManyColumns })) {
        for (const curr of heading) {
            currentWidht =
                curr[index].length > currentWidht
                    ? curr[index].length + 2
                    : currentWidht;
        }

        worksheetCols.push({
            width: currentWidht,
        });

        currentWidht = minWidth;
    }

    ws['!cols'] = worksheetCols;

    const date = new Date().toLocaleDateString('ru');

    writeFileXLSX(wb, `Чек-лист-${date}.xlsx`);
};

export const openAsPDF = async (data: PDFSurveysParams) => {
    const { fields, id } = data;

    const groupedFields = groupFormItemsByCategory(fields);

    const selectedFields = fields.map(field =>
        field.type === 'Lookup' || field.type === 'User'
            ? `${field.name.replace('Id', '')}/Title`
            : field.name
    );

    const expandedFields = fields
        .filter(field => field.type === 'Lookup' || field.type === 'User')
        .map(field => field.name.replace('Id', ''));

    jsPDF.API.events.push(['addFonts', callAddFont]);
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
    });
    doc.setFont('Geometria');
    doc.setFontSize(10);

    await sp.web
        .getList(lists.checkLists)
        .items.getById(id)
        .select(...selectedFields)
        .expand(...expandedFields)()
        .then(item => {
            const obj = Object.fromEntries(
                fields.map(({ name, type }) => {
                    if (type === 'Lookup' || type === 'User') {
                        const fieldName = name.replace('Id', '');
                        const value = item[fieldName]?.Title;
                        return [fieldName, value];
                    }

                    if (type === 'DateTime') {
                        const value = new Date(item[name]).toLocaleDateString(
                            'ru'
                        );

                        return [name, value];
                    }

                    return [name, item[name]];
                })
            );

            const headContent = groupedFields[0].fields
                .map(field => {
                    return `${field.title}: ${
                        obj[field.name.replace('Id', '')]
                    }\n\n`;
                })
                .join('');

            const head = [
                [
                    {
                        content: headContent,
                        colSpan: 3,
                        styles: {
                            valign: 'middle',
                            halign: 'left',
                            fontStyle: 'normal',
                            cellPadding: 2,
                        },
                    },
                ],
                [
                    {
                        content: '№ п.п',
                        styles: {
                            valign: 'middle',
                            halign: 'center',
                            fontStyle: 'bold',
                            cellPadding: 2,
                        },
                    },
                    {
                        content: `Чек-лист для проверки состояния ОТ на ${checkListType}`,
                        styles: {
                            valign: 'middle',
                            halign: 'center',
                            fontStyle: 'bold',
                            cellPadding: 2,
                        },
                    },
                    {
                        content: 'Отметка о выполнении (да/нет)',
                        styles: {
                            valign: 'middle',
                            halign: 'center',
                            fontStyle: 'bold',
                            minCellWidth: 60,
                            cellPadding: 2,
                        },
                    },
                ],
            ] as any[];

            const groups = groupedFields.filter(field => field.id !== 1);

            const body: RowInput[] = [];

            for (let i = 0; i < groups.length; i++) {
                body.push([
                    {
                        colSpan: 3,
                        content: `${i + 1}. ${groups[i].groupTitle}`,
                        styles: {
                            valign: 'middle',
                            halign: 'center',
                            fontStyle: 'bold',
                            fontSize: 11,
                        },
                    },
                ]);

                const cols = groups[i].fields.map((field, idx) => [
                    `${idx + 1}`,
                    field.title,
                    obj[field.name],
                ]);

                body.push(...cols);
            }

            autoTable(doc, {
                head,
                body,
                headStyles: {
                    fillColor: false,
                    textColor: 0,
                    lineColor: [206, 206, 206],
                    lineWidth: 0.1,
                    cellPadding: 0,
                    fontSize: 11,
                },
                styles: {
                    font: 'Geometria',
                    fontStyle: 'normal',
                },
                showHead: 'firstPage',
                theme: 'grid',
            });
            window.open(doc.output('bloburl'), '_blank');
        });
};
