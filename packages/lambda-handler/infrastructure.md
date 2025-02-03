# Adding new topic and giving access

1. Create SNS topic: `infrastructure/modules/ukri_messaging/_outputs.tf `

```
output "awards_topic_arn" {
    value       = module.sns_topics["awards"].topic_arn
    description = "ARN of topic which will receive hydrated awards"
}
```

2. Add variables across multiple services - `infrastructure/environments/_variables/[dev-1]/ukri_messaging/terraform.tfvars`
3. Allow access to SNS - `infrastructure/modules/ukri_service_pd/_data.tf`

```
statement {
    sid = "AllowSNSAccess"
    actions = [
      "sns:Publish",
    ]
    resources = ["*"]
  }
```

4. Give Lambda permission to access encryption keys to encrypt SNS messages

```
statement {
    sid = "AllowKMSAccess"
    actions = [
      "kms:Decrypt",
      "kms:GenerateDataKey"
    ]
    resources = ["*"]
  }
```

5. Remote state - view outputs from messaging

```
data "terraform_remote_state" "ukri_messaging" {
  backend = "s3"

  config = {
    bucket = "${var.aws_profile}-terraform-state"
    key    = "${var.deploy_env}-ukri_messaging.tfstate"
  }
}
```

6. Add lambda env variables in ` infrastructure/modules/ukri_service_pd/lambda_handle_decision.tf` - `AWARDS_TOPIC_ARN = data.terraform_remote_state.ukri_messaging`
