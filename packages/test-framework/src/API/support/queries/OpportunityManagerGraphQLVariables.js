class OpportunityManagerGraphQLVariables {
    tables = [];
    getOpportunity(type) {
        return type === 'created' ? this.oppId : '99999';
    }
    setOpportunity(value) {
        this.oppId = value;
    }
    getDisplayId(type) {
        return type === 'created' ? this.displayId : 'OPP99999';
    }
    setDisplayId(value) {
        this.displayId = value;
    }
    getWorkflowComponent(type) {
        return type === 'created' ? this.wcId : '99999';
    }
    setWorkflowComponent(value) {
        this.wcId = value;
    }
    getApplicationComponent(type) {
        return type === 'created' ? this.awcId : '99999';
    }
    setApplicationComponent(value) {
        this.awcId = value;
    }
    getApplicationComponentCustomQuestion(type) {
        return type === 'created' ? this.CustomQuestionId : '99999';
    }
    setApplicationComponentCustomQuestion(value) {
        this.CustomQuestionId = value;
    }
    getApplicationComponentQuestionset(type) {
        return type === 'created' ? this.QuestionSetId : '99999';
    }
    setApplicationComponentQuestionset(value) {
        this.QuestionSetId = value;
    }
    getApplicationComponentApplicationTitleId(type) {
        return type === 'created' ? this.applicationTitleId : '99999';
    }
    setApplicationComponentApplicationTitleId(value) {
        this.applicationTitleId = value;
    }
    getApplicationComponentApplicationSummaryId(type) {
        return type === 'created' ? this.applicationSummaryId : '99999';
    }
    setApplicationComponentApplicationSummaryId(value) {
        this.applicationSummaryId = value;
    }
    getApplicationComponentApplicationStartDateId(type) {
        return type === 'created' ? this.applicationStartDateId : '99999';
    }
    setApplicationComponentApplicationStartDateId(value) {
        this.applicationStartDateId = value;
    }
    getApplicationComponentResourcesAndCostId(type) {
        return type === 'created' ? this.applicationRaCId : '99999';
    }
    setApplicationComponentResourcesAndCostId(value) {
        this.applicationRaCId = value;
    }
    getApplicationComponentResourcePolicyId(type) {
        return type === 'created' ? this.applicationResourcePolicyId : '99999';
    }
    setApplicationComponentResourcePolicyId(value) {
        this.applicationResourcePolicyId = value;
    }
    getApplicationComponentApplicantId(type) {
        return type === 'created' ? this.ApplicationComponentApplicantId : '99999';
    }
    setApplicationComponentApplicantId(value) {
        this.ApplicationComponentApplicantId = value;
    }
    getExpertReviewComponent(type) {
        return type === 'created' ? this.ExpertReviewComponentId : '99999';
    }
    setExpertReviewComponent(value) {
        this.ExpertReviewComponentId = value;
    }
    displayId = '';
}

module.exports = new OpportunityManagerGraphQLVariables();
