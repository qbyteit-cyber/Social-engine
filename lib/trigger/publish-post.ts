import { task } from "@trigger.dev/sdk/v3"

export interface PublishPayload {
  scheduled_post_id: string
  variant_id: string
  platform: string
  user_id: string
}

export const publishPost = task({
  id: "publish-post",
  run: async (payload: PublishPayload) => {
    const { executePublish } = await import("./execute-publish")
    return executePublish(payload)
  },
})
