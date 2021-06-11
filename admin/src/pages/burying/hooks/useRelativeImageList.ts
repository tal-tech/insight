import {useEffect, useState} from 'react'
import {queryRelatedPage} from '../../../api/tracevisual/tracevisual'

const useRelativeImageList = (id:number) =>{

  const [relativeImageList, setRelativeImageList] = useState<any>([])

  useEffect(()=>{

    const params = {
      id,
      currentPage: 1,
      pageSize: 100
    }

    queryRelatedPage(params).then((res) => {
      // @ts-ignore
      // @ts-ignore
      setRelativeImageList(res.data.pages)
    })
  },[id])

  return [relativeImageList, setRelativeImageList]
}

export default useRelativeImageList
