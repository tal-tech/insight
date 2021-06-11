package types

const (
	AndroidPlatform = `android`
	IOSPlatform     = `iOS`

	AndroidSep    = `#`
	IOSSep        = `/`
	ExtendCreator = `extend`
)

const (
	ProjectXbh = `xhb`
)

type TraceGroupType = string

const (
	ElementChanged   TraceGroupType = "element_changed"
	ElementUnChanged                = "element_unchanged"
	ElementNew                      = "element_new"
)
