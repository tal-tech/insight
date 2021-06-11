package baseresponse

type CodeError struct {
	code int64
	desc string
	data interface{}
}

func (err *CodeError) Error() string {
	return err.desc
}

func (err *CodeError) Code() int64 {
	return err.code
}

func (err *CodeError) Desc() string {
	return err.desc
}

func (err *CodeError) Data() interface{} {
	return err.data
}

func FromError(err error) (codeErr *CodeError, ok bool) {
	if se, ok := err.(*CodeError); ok {
		return se, true
	}
	return nil, false
}
