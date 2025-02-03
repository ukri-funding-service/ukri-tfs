export const opportunityManagerGraphQLQueries = {
    opportunity: 'query getopportunity($Id: ID!){opportunity(displayId: $Id) { {0} {1} }}',
    opportunityList: 'query opportunityList { opportunityList { {0} }}',
    createOpportunity:
        'mutation createOpportunityMutation($name: String!) { createOpportunity(name: $name) { {0} {1}} }',
    associateFunders:
        'mutation  associatefundersmutation($displayId: String, $funders: [OpportunityFunderInput]!, $fundersComplete: Boolean!, $funded: Boolean){ associateFunders(opportunityDisplayId: $displayId, funders: $funders, fundersComplete: $fundersComplete, funded: $funded){ {0} {1} } }',
    applicationComponent:
        'mutation createAWC($opportunityId: ID!, $name: String!) { createApplicationWorkflowComponent(opportunityId: $opportunityId, name: $name) { {0} {1} }}',
    websiteListComponent:
        'mutation createWWC($opportunityId: ID!, $name: String!) { createWebsiteWorkflowComponent(opportunityId: $opportunityId, name: $name) { {0} {1} }}',
    ExpertReviewComponent:
        'mutation createWWC($opportunityId: ID!, $name: String!) { createReviewWorkflowComponent(opportunityId: $opportunityId, name: $name) { {0} {1} }}',
    listComponent:
        'query q ($opportunityId: ID!, $includeApplicationMetadata: Boolean!) { workflowComponentList(opportunityId: $opportunityId, includeApplicationMetadata: $includeApplicationMetadata) { {0} {1} }} ',
    applicationComponentQuestionSet:
        'query applicationComponentQuestionset($applicationComponentId:ID!,$questionsetCode:String!) { applicationComponentQuestionset(applicationComponentId:$applicationComponentId,code:$questionsetCode) { {0} {1} }}',
    applicationComponentQuestionSetList:
        'query applicationComponentQuestionSetList($applicationComponentId:ID!) {applicationComponentQuestionsetList(applicationComponentId:$applicationComponentId){ {0} {1} }}',
    applicationComponentCustomQuestion:
        'mutation createCustomQuestion($applicationWorkflowComponentId: ID!) { createApplicationWorkflowComponentDefaultQuestion (applicationWorkflowComponentId: $applicationWorkflowComponentId) { {0} {1} }}',
    applicationComponentCustomQuestionUpdate:
        'mutation updateCustomQuestion($questionset: ApplicationComponentQuestionsetInput) { updateApplicationComponentQuestionset (questionset: $questionset) { {0} {1} }}',
    workflowComponent: 'query wfc($Id:ID!) {workflowComponent(id: $Id) { {0} {1} } }',
    editOpportunity:
        'mutation editOpportunity($name: String!, $displayId: String!) { editOpportunity(displayId: $displayId,  name: $name) { {0} {1}}}',
    editOpportunityStatus:
        'mutation editOpportunityStatus($displayId: String!, $status: String!) { editOpportunityStatus(displayId: $displayId, status: $status) { {0} {1}} }',
    updateApplicationWorkflowComponent:
        'mutation updateApplicationWorkflowComponent($id: ID!, $openingDateTime: DateTime, $closingDateTime: DateTime) { updateApplicationWorkflowComponent(id: $id, openingDateTime: $openingDateTime, closingDateTime: $closingDateTime) { {0} {1} }}',
    createApplicationWorkflowComponentCostPolicy:
        'mutation createApplicationWorkflowComponentCostPolicy($applicationWorkflowComponentId: ID!) { createApplicationWorkflowComponentCostPolicy(applicationWorkflowComponentId: $applicationWorkflowComponentId) { {0} {1} }}',
    listResourceRoles:
        'query allApplicationComponentResourceRoles { allApplicationComponentResourceRoles { id name } }',
    AddResourceRoles:
        'mutation createApplicationComponentResourcePolicy($applicationWorkflowComponentId: ID!) { createApplicationComponentResourcePolicy(applicationWorkflowComponentId: $applicationWorkflowComponentId) { {0} {1} }}',
    UpdateResourceRoles:
        'mutation Q($resourcePolicy: ApplicationComponentResourcePolicyInput) { updateApplicationComponentResourcePolicy(resourcePolicy: $resourcePolicy) { {0} {1} }}',
    UpdateExpertReviewComponent:
        'mutation review($id: ID!, $wordCount: Int, $guidelines: String, $isComplete: Boolean!) {updateReviewWorkflowComponent(id: $id, wordCount: $wordCount, guidelines: $guidelines, isComplete: $isComplete) { {0} {1} }}',

    queryMap: {
        createOpportunity: 'createOpportunity',
        associateFunders: 'associateFunders',
        applicationComponent: 'createApplicationWorkflowComponent',
        websiteListComponent: 'createWebsiteWorkflowComponent',
        ExpertReviewComponent: 'createReviewWorkflowComponent',
        listComponent: 'workflowComponentList',
        applicationComponentCustomQuestion: 'createApplicationWorkflowComponentDefaultQuestion',
        applicationComponentCustomQuestionUpdate: 'updateApplicationComponentQuestionset',
        workflowComponent: 'workflowComponent',
        editOpportunity: 'editOpportunity',
        applicationComponentQuestionSetList: 'applicationComponentQuestionsetList',
        applicationComponentQuestionSet: 'applicationComponentQuestionset',
        updateApplicationWorkflowComponent: 'updateApplicationWorkflowComponent',
        editOpportunityStatus: 'editOpportunityStatus',
        createApplicationWorkflowComponentCostPolicy: 'createApplicationWorkflowComponentCostPolicy',
        listResourceRoles: 'allApplicationComponentResourceRoles',
        AddResourceRoles: 'createApplicationComponentResourcePolicy',
        UpdateResourceRoles: 'updateApplicationComponentResourcePolicy',
        opportunityList: 'opportunityList',
        UpdateExpertReviewComponent: 'updateReviewWorkflowComponent',
    },
};
