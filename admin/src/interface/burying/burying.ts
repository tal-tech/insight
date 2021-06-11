

export interface UrlParamsProps {
  pageGroupId:string,
  pageName:string
  phoneType?:string
}


export interface DetailPageProps {
  goBack: () => void;
  urlParams: UrlParamsProps
  updateRelativePage:(item:UrlParamsProps)=>void
}

export interface AndroidAndIOSType {
  androidId: number,
  iosId: number
}

