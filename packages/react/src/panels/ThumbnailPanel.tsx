import React, { useEffect, useState, useCallback } from 'react'
import { observer } from '@slides/reactive-react'
import cls from 'classnames'
import { usePrefix, useWorkbench } from '../hooks'
import { uid } from '@editor/shared'
import { useGlobalData } from '../hooks/useGlobalData'
import {
  IDesignerComponents,
  pageItems,
  disabledPageItems,
  sectionItems,
  disabledSectionItems,
  deleteSelectPages,
} from '../types'
import { CustomComponentTreeWidget, PageTypeLabelWidget } from '../widgets'
import { VIEWPORT_SIZE } from '../containers'
import { Dropdown, Modal, message, Input } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { AddPage } from '../widgets/AddPageWidget'
import { SectionCom } from '../widgets/SectionComWidget'
import { withErrorBoundary } from 'react-error-boundary'
import { PageType, items } from '../widgets/AddPageWidget'

export interface IThumbnailPanelProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  extra?: React.ReactNode;
  thumbnailList: any[];
  currentWorkspaceId: string;
  components: IDesignerComponents;
  resourceHost: string;
  setWorkspaceList: Function;
  setCurrentWorkspaceId: Function;
  handleCreatePageId: Function;
  deletePage: Function;
  changeMenu?: (
    item: { pageType: number },
    arr: {
      [key: string]: any;
    }[]
  ) => any[];
}

const getSectionIndex = (list: any, index: number) => {
  // 找到点击的节点距离下一个节点距离
  for (let i = index + 1; i < list.length; i++) {
    if (!list[i]?.type && list[i]) {
      return i
    }
  }
  return null
}

const reconstructArray = (list: any[]) => { // 对含有页面及节点的数据做重建，使节点包含的页面显示正确
  const resultArray = []
  for (let i = 0; i < list.length; i++) {
    if (list[i]?.type) {
      if (getSectionIndex(list, i)) {
        const nextIndex = getSectionIndex(list, i)
        const sectionList = []
        while (i < nextIndex) {
          sectionList.push(list[i])
          i++
        }
        if (list[nextIndex].section?.length > 0) {
          list[nextIndex].section = [
            ...list[nextIndex].section,
            ...sectionList,
          ]

          resultArray.push(list[nextIndex])

          return resultArray
        } else {
          list[nextIndex].section = [...sectionList]
          resultArray.push(list[nextIndex])
        }
      } else {
        const nextSectionList = []
        while (i < list.length) {
          nextSectionList.push(list[i])
          i++
        }
        if (resultArray[resultArray.length - 1].nextSection?.length > 0) {
          resultArray[resultArray.length - 1].nextSection = [
            ...resultArray[resultArray.length - 1].nextSection,
            ...nextSectionList,
          ]
        } else {
          resultArray[resultArray.length - 1].nextSection = [
            ...nextSectionList,
          ]
        }
      }
    } else {
      resultArray.push(list[i])
    }
  }

  return resultArray
}

const getPageIndex = (index: number, result) => {
  // 找到点击节点的下一个节点索引
  for (let i = index + 1; i < result.length; i++) {
    if (result[i]?.type) {
      return i
    }
  }
  return result.length
}
const getLastTagIndex = (index: number, result) => {
  // 找到拖拽的页面距离上一个节点距离
  for (let i = index - 1; i >= 0; i--) {
    if (result[i]?.type) {
      return i
    }
  }
  return -1
}

const reorder = (
  list: any,
  sourceIndex: number,
  destinationIndex: number
) => {
  if (sourceIndex !== destinationIndex) {
    const result = Array.from([...list])
    let removed;
    const moveLen = getPageIndex(sourceIndex, list) - sourceIndex
    let tagIndex
    // 判断是向上拖拽还是向下拖拽，修改destinationIndex索引值，为了找到正确的上层节点
    if (sourceIndex < destinationIndex) {
      tagIndex = getLastTagIndex(destinationIndex + 1, list)
    } else {
      tagIndex = getLastTagIndex(destinationIndex, list)
    }
    if (result[sourceIndex].type) { // 移动节点
      if (result[sourceIndex].secPack) { // 如果移动的是闭合的节点，把节点展开，并且里面的page也露出，保证数字正确，方便包含其他页面
        result[sourceIndex].secPack = false
        for (let i = 1; i < moveLen; i++) {
          result[sourceIndex + i].isPack = false
        }
      }
      if (tagIndex !== -1 && result[tagIndex].secPack) { // 如果是移动到闭合节点下方, 保证destinationIndex正确，在闭合节点下方splice
        if (sourceIndex < destinationIndex) {
          destinationIndex = getPageIndex(tagIndex, list) - 1
        } else {
          destinationIndex = getPageIndex(tagIndex, list)
        }
      }
      removed = result.splice(sourceIndex, moveLen)
      if (sourceIndex < destinationIndex) { // 判断是向上拖拽还是向下拖拽，找到正确的索引位置添加删除的节点
        result.splice(destinationIndex + 1 - moveLen, 0, ...removed)
      } else {
        result.splice(destinationIndex, 0, ...removed)
      }
    } else { // 移动页面
      // const tagIndex = getLastTagIndex(destinationIndex, list)
      if (tagIndex !== -1 && result[tagIndex].secPack) { // 如果是移动到闭合的节点，放在节点末尾，并且所有页面和节点都是合并状态
        const nextTag = getPageIndex(tagIndex, list)
        result[tagIndex].count += 1
        result[sourceIndex].isPack = true

        removed = result.splice(sourceIndex, 1)
        if (sourceIndex < destinationIndex) { // 判断是向上拖拽还是向下拖拽，找到正确的节点末尾添加删除的节点
          result.splice(nextTag - 1, 0, ...removed)
        } else {
          result.splice(nextTag, 0, ...removed)
        }
      } else { // 如果是移动到开放的节点，正常 -1 +1 操作
        removed = result.splice(sourceIndex, 1)
        result.splice(destinationIndex, 0, ...removed)
      }
    }

    return result
  } else {
    const result = Array.from([...list])
    return result
  }
}

export const ThumbnailPanel: React.FC<IThumbnailPanelProps> = observer(
  (props) => {
    const thumbnailWrapperHeight = 135
    const prefix = usePrefix('thumbnail-panel')
    const [visible, setVisible] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sectionClickData, setSectionClickData] = useState<{ id: string, name: string }>({} as any)
    const [deletePageType, setDeletePageType] = useState({
      index: 0,
      type: false,
    })
    useEffect(() => {
      setVisible(true)
    }, [])
    const {
      thumbnailList,
      currentWorkspaceId,
      changeMenu,
      setWorkspaceList,
      setCurrentWorkspaceId,
      handleCreatePageId,
      deletePage,
    } = props
    const viewportRatio = useGlobalData().viewportRatio
    const thumbnailHeight = thumbnailWrapperHeight - 20
    const thumbnailWidth = Math.floor(thumbnailHeight / viewportRatio)
    const workbench = useWorkbench()
    const workspaces = workbench?.workspaces
    const [dataSource, setDataSource] = useState<any[]>([])
    const [selectedDivs, setSelectedDivs] = useState([])
    const [clickIndex, setClickIndex] = useState(NaN)
    const [selectDataSource, setSelectDataSource] = useState([])

    useEffect(() => {
      flattenArray()
    }, [thumbnailList])

    const dragPage = useCallback(
      (result: any, dataList: any) => {
        const items = reorder(
          dataList,
          result.source.index,
          result.destination?.index
        )

        const list = reconstructArray(items).filter((o) => o)

        setWorkspaceList(list)
      },
      [workbench, thumbnailList]
    )

    // 多选删除
    const deletePages = useCallback(
      async (menuKey: string, pagesData: any, deleteList: string[]) => {
        if (menuKey == 'delete-sections') {
          const list = reconstructArray(pagesData).filter((o) => o)
          setWorkspaceList(list)
          await deletePage({
            pageIdList: deleteList,
          })
          selectThumbnail(list[0]['id'])
          deleteList.forEach((item) => {
            workbench.removeWorkspace(item)
          })
        }
      },
      [workbench, thumbnailList]
    )


    const selectThumbnail = useCallback(
      (id) => {
        console.log(currentWorkspaceId, 'currentWorkspaceId')
        const current = workbench.findWorkspaceById(id)
        workbench.setActiveWorkspace(current)
        workbench.switchWorkspace(id)
        console.log(id, 'ooopp')
        setCurrentWorkspaceId(id)
        const operation = workbench.activeWorkspace.operation
        const tree = operation.tree
        const selection = operation.selection
        selection.select(tree.id)
      },
      [workbench, currentWorkspaceId]
    )


    // 操作节点
    const rightClickSectionMenu = useCallback(
      (menuKey: any, data: any) => {
        if (menuKey == 'delete-section') {
          setWorkspaceList((prevWorkspaceList) =>
            prevWorkspaceList.map((item) => {
              if (item?.section?.length > 0) {
                item?.section.map((sec) => {
                  if (sec?.id === data?.id) {
                    const deleIndex = item.section.indexOf(sec)
                    item.section.splice(deleIndex, 1)
                    return sec
                  }
                })
              }

              if (item?.nextSection?.length > 0) {
                item?.nextSection.map((next) => {
                  if (next?.id === data?.id) {
                    const deleIndex = item.nextSection.indexOf(next)
                    item.nextSection.splice(deleIndex, 1)
                    return next
                  }
                })
              }
              return { ...item }
            })
          )
        } else if (menuKey == 'ren-slide') {
          setSectionClickData(data)
          setIsModalOpen(true)
        }
      },
      [workbench, thumbnailList]
    )

    // 右键操作页面
    const rightClickPageMenu = useCallback(
      async (menuKey: any, pagesData: any, deleteIndex?: number) => {
        const currentWorkspace = workbench.currentWorkspace
        if (menuKey == 'add-section') {
          const addList = thumbnailList.map((item) => {
            if (item.id == currentWorkspace.id) {
              if (item?.section?.length > 0) {
                return {
                  ...item,
                  section: [
                    {
                      name: '无标题节',
                      id: uid(),
                      secPack: false,
                    },
                    ...item.section,
                  ],
                }
              } else {
                return {
                  ...item,
                  section: [
                    {
                      name: '无标题节',
                      id: uid(),
                      secPack: false,
                    },
                  ],
                }
              }
            }
            return item
          })
          setWorkspaceList(addList)
        } else if (menuKey == 'add-slide') {
          addThumbnail({ pageType: pagesData.pageType })
        } else if (menuKey == 'delete-slide') {
          const list = reconstructArray(pagesData).filter((o) => o)
          setWorkspaceList(list)
          setDeletePageType({ index: deleteIndex, type: true })
          await deletePage({
            pageIdList: [currentWorkspaceId],
          })
          workbench.removeWorkspace(currentWorkspaceId)
        }
      },
      [workbench, thumbnailList, currentWorkspaceId]
    )

    const handleOk = () => {
      setIsModalOpen(false)
      setWorkspaceList((prevWorkspaceList) =>
        prevWorkspaceList.map((item) => {
          if (item?.section?.length > 0) {
            const index = item.section.findIndex((o) => o.id === sectionClickData?.id)
            index >= 0 && (item.section[index].name = sectionClickData?.name)
          }
          if (item?.nextSection?.length > 0) {
            const index = item.nextSection.findIndex((o) => o.id === sectionClickData?.id)
            index >= 0 && (item.nextSection[index].name = sectionClickData?.name)
          }
          return { ...item }
        })
      )
    }

    const handleCancel = () => {
      setIsModalOpen(false)
    }

    const handleInputChange = (e) => {
      setSectionClickData((prevData) => ({
        ...prevData,
        name: e.target.value,
      }))
    }

    const renModal = () => (
      <Modal
        title="重命名"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={300}
        okText="确定"
        cancelText="取消"
      >
        <Input
          placeholder="重命名"
          value={sectionClickData.name}
          onChange={handleInputChange}
        />
      </Modal>
    )

    useEffect(() => {
      if (deletePageType.type) {
        handleDeleteWorkspace()
      }
    }, [deletePageType])

    // 获取删除节点
    const handleDeleteWorkspace = async () => {
      const pageDivHTML = document.querySelector('[data-rbd-droppable-id="list"]')
      const pageListHTML = pageDivHTML.childNodes
      const pageListHTMLFilter = []

      pageListHTML.forEach((res) => {
        if (
          res.nodeType == 1 &&
          (res as any)?.classList?.contains('ld-thumbnail-panel-drag-container')
        ) {
          pageListHTMLFilter.push(res)
        }
      })

      if (deletePageType.index == thumbnailList?.length) {
        const clickPagePanel = pageListHTMLFilter[deletePageType.index - 1]
        const clickPage = clickPagePanel.childNodes[0].childNodes[0]
        clickPage?.click()
        setDeletePageType({ index: 0, type: false })
      } else {
        const clickPagePanel = pageListHTMLFilter[deletePageType.index + 1]
        const clickPage = clickPagePanel.childNodes[0].childNodes[0]
        clickPage?.click()
        setDeletePageType({ index: 0, type: false })
      }
    }


    // 新增课件页
    const addThumbnail = useCallback(
      async (newItem: any) => {
        const { page, pageId } = await handleCreatePageId(newItem)
        const data = { ...page.pageInfo, pageType: page.pageType }
        const index = thumbnailList.findIndex(
          (item) => item.id === currentWorkspaceId
        )
        const newWorkspace = workbench.ensureWorkspace(data)
        newWorkspace.engine.setCurrentTree(data)
        setWorkspaceList(v => {
          v.splice(index + 1, 0, data)
          return [...v]
        })
        setCurrentWorkspaceId(pageId)
      },
      [workbench, thumbnailList, currentWorkspaceId]
    )

    const flattenArray = () => {
      const newArrayList = []
      const thumbnailLists = JSON.parse(JSON.stringify(thumbnailList))
      thumbnailLists.forEach((item) => {
        if (item.section) {
          item.section.forEach((sectionItem) => {
            newArrayList.push({
              ...sectionItem,
              type: 'section',
              parent: {
                id: item.id,
                pageTitle: item.pageTitle,
              },
            })
          })
        }

        newArrayList.push({
          ...item,
          section: [],
          nextSection: [],
        })

        if (item.nextSection) {
          item.nextSection.forEach((nextSectionItem) => {
            newArrayList.push({
              ...nextSectionItem,
              type: 'nextSection',
              parent: {
                id: item.id,
                pageTitle: item.pageTitle,
              },
            })
          })
        }
      })
      setDataSource(newArrayList)
    }

    const handlePageMenuClick = (e: any, data: any) => {
      if (e.key == 'delete-slide') {
        const newDataSource = dataSource.filter((item: any) => {
          return item.id !== data.id
        })
        const deleteIndex = dataSource
          .filter((item) => !item?.type)
          .indexOf(data)
        rightClickPageMenu(e.key, newDataSource, deleteIndex)
      } else {
        rightClickPageMenu(e.key,data)
      }
    }

    const handleSectionMenuClick = (e: any, data: any) => {
      rightClickSectionMenu(e.key, data)
    }

    const sectionMenuItems = (item: any, index: number) => {
      if (
        dataSource?.[index + 1]?.type == 'section' ||
        dataSource.length - 1 == index
      ) {
        return sectionItems
      } else {
        return disabledSectionItems
      }
    }

    const nextSectionMenuItems = (item: any, index: number) => {
      if (
        dataSource?.[index + 1]?.type == 'nextSection' ||
        dataSource.length - 1 == index
      ) {
        return sectionItems
      } else {
        return disabledSectionItems
      }
    }

    const getPageIndex = (index: number) => {
      // 找到点击的节点距离下一个节点距离
      for (let i = index + 1; i < dataSource.length; i++) {
        if (dataSource[i]?.type) {
          return i
        }
      }
    }
    const sectionClickUn = (index: number) => {
      // 节点下个对象是不是页面
      // 如果不是页面的话直接复制count为0
      if (dataSource[index + 1]?.type) {
        setDataSource((pre) =>
          pre.map((dataItem, dataIndex) => {
            if (index == dataIndex) {
              dataItem.count = 0
              if (dataItem?.secPack) {
                dataItem.secPack = false
              } else {
                dataItem.secPack = true
              }
            }
            return { ...dataItem }
          })
        )
      } else {
        // 如果是页面的话判断页面一直到下一个节点的距离

        // 拿到页面下一个节点的距离
        const nextSectionIndex = getPageIndex(index) - 1 || dataSource.length - 1
        // 当前的节点赋值count为下一个节点索引减去当前节点的索引，为中间有几个页面
        dataSource[index].count = nextSectionIndex - index
        setDataSource((pre) =>
          pre.map((dataItem, dataIndex) => {
            if (dataIndex == index) {
              dataItem.count = dataSource[index].count
              if (dataItem.secPack) {
                dataItem.secPack = false
              } else {
                dataItem.secPack = true
              }
            }
            if (nextSectionIndex >= dataIndex && dataIndex > index) {
              dataItem.isPack = dataSource[index].secPack
              dataSource[dataIndex].isPack = dataSource[index].secPack
            }
            return { ...dataItem }
          })
        )
      }
      return dataSource
    }

    const dragPageFu = (result) => {
      const { destination, source } = result
      // const index = result.source.index
      // if (dataSource[index].type && dataSource[index].secPack) {
      //   sectionClickUn(index)
      // }
      if (source.index !== destination.index) {
        dragPage(result, dataSource)
      }
    }
    const onDragStart = (result) => {
      const index = result.source.index
      if (dataSource[index].type && !dataSource[index].secPack) { // 含有页面的节点，折叠移动
        sectionClickUn(index)
      }
    }
    const handleDivClick = (divId, shiftKey, e, item) => {
      // 如果按住Shift键，进行多选
      if (shiftKey) {
        // debugger
        let start, end
        start = Math.min(clickIndex, divId)
        end = Math.max(clickIndex, divId)
        const newSelection = Array.from(
          { length: end - start + 1 },
          (_, index) => start + index
        )
        setSelectedDivs([...newSelection])
        const selectList = newSelection.map((index) => dataSource[index])
        const selectDataSource = selectList.filter((item) => {
          return !item?.type
        })
        setSelectDataSource([...selectDataSource])
      } else {
        // 否则单选
        setSelectedDivs([])
        selectThumbnail(item.id)
        setClickIndex(divId)
      }
    }

    const multiplePages = (e) => {
      if (e.key == 'delete-sections') {
        if (selectDataSource?.length == dataSource?.length) {
          message.warning('至少保留一个课件页')
        } else {
          const filterData = dataSource.filter(
            (item) => selectDataSource.indexOf(item) == -1
          )
          deletePages(e.key, filterData, selectDataSource.map(item => item.id))
        }
      } else {
        console.log(e)
      }
    }
    return (
      <div className={cls(prefix, { visible })}>
        <div className={prefix + '-layout'}>
          <Dropdown
            menu={{
              items: selectedDivs?.length > 0 ? deleteSelectPages : [],
              onClick: (e) => multiplePages(e),
            }}
            trigger={['contextMenu']}
          >
            <div className={prefix + '-wrapper'}>
              <DragDropContext onDragEnd={(result) => dragPageFu(result)} onDragStart={(result) => onDragStart(result)}>
                <Droppable droppableId="list">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {dataSource.map((item, index) => {
                        const workspace = workspaces.find(page => item.id === page.id)
                        const tree = workspace?.operation.tree
                        const root = tree?.root
                        const rootProps = root?.props
                        return (
                          <div
                            key={index + item.id}
                            className={
                              !item?.type
                                ? 'ld-thumbnail-panel-drag-container'
                                : ''
                            }
                          >
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {item?.type == 'section' && (
                                    <Dropdown
                                      menu={{
                                        items: sectionMenuItems(item, index),
                                        onClick: (e) =>
                                          handleSectionMenuClick(e, item),
                                      }}
                                      trigger={['contextMenu']}
                                      key={item.id}
                                    >
                                      <div
                                        onClick={() =>
                                          sectionClickUn(index)
                                        }
                                      >
                                        <SectionCom data={item} />
                                      </div>
                                    </Dropdown>
                                  )}
                                  {item?.type == 'nextSection' && (
                                    <Dropdown
                                      menu={{
                                        items: nextSectionMenuItems(
                                          item,
                                          index
                                        ),
                                        onClick: (e) =>
                                          handleSectionMenuClick(e, item),
                                      }}
                                      trigger={['contextMenu']}
                                      key={item.id}
                                    >
                                      <div
                                        onClick={() =>
                                          sectionClickUn(index)
                                        }
                                      >
                                        <SectionCom data={item} />
                                      </div>
                                    </Dropdown>
                                  )}
                                  {!item?.type && (
                                    <>
                                      {!item?.isPack ? (
                                        <div
                                          onClick={(e) =>
                                            handleDivClick(
                                              index,
                                              e.shiftKey,
                                              e,
                                              item
                                            )
                                          }
                                          key={item.id + item.id}
                                          className={prefix + '-item-wrapper'}
                                          style={{
                                            height:
                                              (rootProps?.info?.name &&
                                                rootProps.info.name.length > 0
                                                ? thumbnailWrapperHeight + 22
                                                : thumbnailWrapperHeight) +
                                              'px',
                                          }}
                                        >
                                          <div
                                            className={cls(
                                              prefix + '-item-label',
                                              {
                                                active:
                                                  currentWorkspaceId ===
                                                  item.id,
                                              }
                                            )}
                                          >
                                            {thumbnailList.findIndex(
                                              (o) => o.id == item.id
                                            ) + 1}
                                          </div>
                                          {rootProps?.info?.name &&
                                            rootProps.info.name.length > 0 && (
                                              <div
                                                className={
                                                  prefix + '-item-title'
                                                }
                                                title={rootProps.info.name}
                                                style={{
                                                  width: thumbnailWidth + 'px',
                                                  maxWidth:
                                                    thumbnailWidth + 'px',
                                                  height: '22px',
                                                  lineHeight: '22px',
                                                }}
                                              >
                                                {rootProps.info.name}
                                              </div>
                                            )}

                                          <Dropdown
                                            menu={
                                              currentWorkspaceId === item.id
                                                ? {
                                                  items:
                                                    thumbnailList?.length > 1
                                                      ? changeMenu(item, pageItems)
                                                      : changeMenu(item, disabledPageItems),
                                                  onClick: (e) =>
                                                    handlePageMenuClick(
                                                      e,
                                                      item
                                                    ),
                                                }
                                                : { items: [] }
                                            }
                                            trigger={['contextMenu']}
                                          >
                                            <div
                                              className={cls(
                                                prefix + '-item-content',
                                                {
                                                  active:
                                                    currentWorkspaceId ===
                                                    item.id,
                                                }
                                              )}
                                              style={{
                                                width: thumbnailWidth + 'px',
                                                height: thumbnailHeight + 'px',
                                                top:
                                                  rootProps?.info?.name &&
                                                    rootProps.info.name.length > 0
                                                    ? '32px'
                                                    : '10px',
                                                overflow: 'hidden',
                                                outline:
                                                  currentWorkspaceId ===
                                                    item.id ||
                                                    selectedDivs.includes(index)
                                                    ? '2px solid #1890ff'
                                                    : 'none',
                                              }}
                                            >
                                              <PageTypeLabelWidget rootProps={rootProps} />
                                              <div
                                                className={
                                                  prefix + '-view-content'
                                                }
                                                style={{
                                                  transform: `scale(${thumbnailWidth /
                                                    VIEWPORT_SIZE
                                                    })`,
                                                }}
                                              >
                                                <CustomComponentTreeWidget
                                                  components={props.components}
                                                  workspaceId={item.id}
                                                  resourceHost={props.resourceHost}
                                                />
                                              </div>
                                            </div>
                                          </Dropdown>
                                        </div>
                                      ) : null}
                                    </>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          </div>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </Dropdown>
        </div>
        {/* {deleteModal()} */}
        <div className={prefix + '-add-page-container'}>
          <AddPage
            onClick={(pageType: number) =>
              addThumbnail({ pageType })
            }
          />
        </div>
        {renModal()}
      </div>
    )
  }
)

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export const ThumbnailPanelWithErrorBoundary = withErrorBoundary(ThumbnailPanel, {
  FallbackComponent: ErrorFallback,
  onError(error, info) {
    console.error(error, info)
  },
})
