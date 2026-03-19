package callback

import "context"

type Service interface {
	CallbackXendit(ctx context.Context, payload XenditCallbackRequest) error
}
