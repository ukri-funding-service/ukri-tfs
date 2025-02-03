export const structuredCosts = {
    policyRoles: [
        { id: 3, name: 'Co-investigator' },
        { id: 4, name: 'Researcher' },
        { id: 5, name: 'Business partner' },
        { id: 6, name: 'Technician' },
        { id: 7, name: 'Fellow' },
        { id: 2, name: 'Principal investigator' },
        { id: 1, name: 'Lead applicant' },
        { id: 8, name: 'Project lead' },
        { id: 9, name: 'Project co-lead (UK)' },
        { id: 10, name: 'Project co-lead (international)' },
        { id: 11, name: 'Specialist' },
        { id: 12, name: 'Grant manager' },
        { id: 14, name: 'Doctoral student' },
        { id: 15, name: 'Research and innovation associate' },
        { id: 16, name: 'Technician' },
        { id: 18, name: 'Fellow' },
        { id: 13, name: 'Professional enabling staff' },
        { id: 19, name: 'Researcher co-lead' },
        { id: 17, name: 'Visiting researcher' },
    ],
    applicants: [
        {
            id: 1,
            applicationPersonId: 1000168,
            organisationId: 1,
            name: 'UI Smoke',
            email: 'UI-smoketest@mmfdxrv3.mailosaur.net',
            role: 'Project lead',
            organisationName: 'University of Birmingham',
        },
        {
            id: 2,
            applicationPersonId: 1000167,
            organisationId: 1,
            name: 'Tim Berners-Lee',
            email: 'specialist@birmingham.ac.uk',
            role: 'Specialist',
            organisationName: 'University of Birmingham',
        },
        {
            id: 3,
            applicationPersonId: 1000166,
            organisationId: 339,
            name: 'Doctoral Gadget',
            email: 'doctorg@example.com',
            role: 'Doctoral student',
            organisationName: 'Abertay University',
        },
    ],
    costPolicyCategories: [
        {
            id: 1361,
            name: 'Directly allocated',
            sequence: 1,
            percentageValue: 80,
            parentId: 0,
        },
        {
            id: 1365,
            name: 'Staff',
            sequence: 1,
            percentageValue: 80,
            parentId: 1361,
        },
        {
            id: 1368,
            name: 'Staff',
            sequence: 1,
            percentageValue: 80,
            parentId: 1362,
        },
        {
            id: 1372,
            name: 'Indirect costs',
            sequence: 1,
            percentageValue: 80,
            parentId: 1363,
        },
        {
            id: 1373,
            name: 'Staff',
            sequence: 1,
            percentageValue: 100,
            parentId: 1364,
        },
        {
            id: 1362,
            name: 'Directly incurred',
            sequence: 2,
            percentageValue: 80,
            parentId: 0,
        },
        {
            id: 1366,
            name: 'Estates',
            sequence: 2,
            percentageValue: 80,
            parentId: 1361,
        },
        {
            id: 1369,
            name: 'Equipment',
            sequence: 2,
            percentageValue: 80,
            parentId: 1362,
        },
        {
            id: 1374,
            name: 'Equipment',
            sequence: 2,
            percentageValue: 100,
            parentId: 1364,
        },
        {
            id: 1363,
            name: 'Indirect',
            sequence: 3,
            percentageValue: 80,
            parentId: 0,
        },
        {
            id: 1367,
            name: 'Other',
            sequence: 3,
            percentageValue: 80,
            parentId: 1361,
        },
        {
            id: 1370,
            name: 'Travel and subsistence',
            sequence: 3,
            percentageValue: 80,
            parentId: 1362,
        },
        {
            id: 1375,
            name: 'Travel and subsistence',
            sequence: 3,
            percentageValue: 100,
            parentId: 1364,
        },
        {
            id: 1364,
            name: 'Exceptions',
            sequence: 4,
            percentageValue: 100,
            parentId: 0,
        },
        {
            id: 1371,
            name: 'Other',
            sequence: 4,
            percentageValue: 80,
            parentId: 1362,
        },
        {
            id: 1376,
            name: 'Other',
            sequence: 4,
            percentageValue: 100,
            parentId: 1364,
        },
    ],
    costPolicyCategoryTrees: [
        {
            id: 1361,
            name: 'Directly allocated',
            sequence: 1,
            percentageValue: 80,
            children: [
                {
                    id: 1365,
                    name: 'Staff',
                    sequence: 1,
                    percentageValue: 80,
                    children: [],
                },
                {
                    id: 1366,
                    name: 'Estates',
                    sequence: 2,
                    percentageValue: 80,
                    children: [],
                },
                {
                    id: 1367,
                    name: 'Other',
                    sequence: 3,
                    percentageValue: 80,
                    children: [],
                },
            ],
        },
        {
            id: 1362,
            name: 'Directly incurred',
            sequence: 2,
            percentageValue: 80,
            children: [
                {
                    id: 1368,
                    name: 'Staff',
                    sequence: 1,
                    percentageValue: 80,
                    children: [],
                },
                {
                    id: 1369,
                    name: 'Equipment',
                    sequence: 2,
                    percentageValue: 80,
                    children: [],
                },
                {
                    id: 1370,
                    name: 'Travel and subsistence',
                    sequence: 3,
                    percentageValue: 80,
                    children: [],
                },
                {
                    id: 1371,
                    name: 'Other',
                    sequence: 4,
                    percentageValue: 80,
                    children: [],
                },
            ],
        },
        {
            id: 1363,
            name: 'Indirect',
            sequence: 3,
            percentageValue: 80,
            children: [
                {
                    id: 1372,
                    name: 'Indirect costs',
                    sequence: 1,
                    percentageValue: 80,
                    children: [],
                },
            ],
        },
        {
            id: 1364,
            name: 'Exceptions',
            sequence: 4,
            percentageValue: 100,
            children: [
                {
                    id: 1373,
                    name: 'Staff',
                    sequence: 1,
                    percentageValue: 100,
                    children: [],
                },
                {
                    id: 1374,
                    name: 'Equipment',
                    sequence: 2,
                    percentageValue: 100,
                    children: [],
                },
                {
                    id: 1375,
                    name: 'Travel and subsistence',
                    sequence: 3,
                    percentageValue: 100,
                    children: [],
                },
                {
                    id: 1376,
                    name: 'Other',
                    sequence: 4,
                    percentageValue: 100,
                    children: [],
                },
            ],
        },
    ],
    linkedCosts: [
        {
            id: 68,
            linkedCostCategories: [
                {
                    id: 65,
                    opportunityCostPolicyCategoryId: 1365,
                    costAmountGbp: 10000,
                },
            ],
            staffCosts: [
                {
                    id: 4,
                    applicationPersonId: 1000168,
                    opportunityCostCategoryId: 1365,
                    applicationCostId: 68,
                    ftePercentage: 78,
                    fullEconomicCostPence: 1000000,
                    startDate: new Date('2023-08-01T00:00:00.000Z'),
                    endDate: new Date('2023-09-01T00:00:00.000Z'),
                },
            ],
            organisationId: 339,
        },
        {
            id: 67,
            linkedCostCategories: [
                {
                    id: 66,
                    opportunityCostPolicyCategoryId: 1366,
                    costAmountGbp: 200008,
                },
                {
                    id: 67,
                    opportunityCostPolicyCategoryId: 1367,
                    costAmountGbp: 100,
                },
                {
                    id: 68,
                    opportunityCostPolicyCategoryId: 1372,
                    costAmountGbp: 17656,
                },
                {
                    id: 69,
                    opportunityCostPolicyCategoryId: 1365,
                    costAmountGbp: 1000000,
                },
                {
                    id: 70,
                    opportunityCostPolicyCategoryId: 1368,
                    costAmountGbp: 2500000,
                },
                {
                    id: 71,
                    opportunityCostPolicyCategoryId: 1373,
                    costAmountGbp: 6700,
                },
                {
                    id: 72,
                    opportunityCostPolicyCategoryId: 1369,
                    costAmountGbp: 30000,
                },
                {
                    id: 73,
                    opportunityCostPolicyCategoryId: 1370,
                    costAmountGbp: 2657,
                },
            ],
            staffCosts: [
                {
                    id: 3,
                    unnamedRoleId: 14,
                    opportunityCostCategoryId: 1373,
                    applicationCostId: 67,
                    ftePercentage: 67,
                    fullEconomicCostPence: 670000,
                    startDate: new Date('2023-08-01T00:00:00.000Z'),
                    endDate: new Date('2023-09-01T00:00:00.000Z'),
                },
                {
                    id: 2,
                    applicationPersonId: 1000167,
                    opportunityCostCategoryId: 1368,
                    applicationCostId: 67,
                    ftePercentage: 84,
                    fullEconomicCostPence: 250000000,
                    startDate: new Date('2023-07-01T00:00:00.000Z'),
                    endDate: new Date('2023-08-01T00:00:00.000Z'),
                },
                {
                    id: 1,
                    applicationPersonId: 1000166,
                    opportunityCostCategoryId: 1365,
                    applicationCostId: 67,
                    ftePercentage: 92,
                    fullEconomicCostPence: 100000000,
                    startDate: new Date('2023-07-01T00:00:00.000Z'),
                    endDate: new Date('2023-08-01T00:00:00.000Z'),
                },
            ],
            organisationId: 1,
        },
    ],
    breakdownUrl: '',
    justification: '<p>Justification, I think we are qualified and we can do a good job</p>',
};
