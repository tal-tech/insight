import React, { FC, useEffect, useState } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import TagsViewAction from "./tagViewAction";
import usePrevious from "hooks/usePrevious";
import { useAppDispatch, useAppState } from "stores";
import { addTag, removeTag, setActiveTag } from "stores/tags-view.store";

const { TabPane } = Tabs;

const TagsView: FC = () => {
  const { tags, activeTagId } = useAppState((state) => state.tagsView);
  const { menuList, locale } = useAppState((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const prevActiveTagId = usePrevious(activeTagId);
  const { pathname } = useLocation();
  console.log("useLocation", useLocation());
  // onClick tag
  const onChange = (key: string) => {
    dispatch(setActiveTag(key));
  };

  // onRemove tag
  const onClose = (targetKey: string) => {
    dispatch(removeTag(targetKey));
  };

  useEffect(() => {
    if (menuList.length) {
      const menu = menuList.find((m) => m.path === location.pathname) || {
        icon: "dashboard",
        key: "0",
        label: { zh_CN: "首页", en_US: "Dashboard" },
        name: "dashboard",
        path: "/dashboard",
      };

      if (menu) {
        // Initializes dashboard page.
        const dashboard = menuList[0];
        dispatch(
          addTag({
            path: dashboard.path,
            label: dashboard.label,
            id: dashboard.key,
            closable: false,
          })
        );
        // Initializes the tag generated for the current page
        // Duplicate tag will be ignored in redux.
        dispatch(
          addTag({
            path: menu.path,
            label: menu.label,
            id: menu.key,
            closable: true,
          })
        );
      }
    }
  }, [dispatch, location.pathname, menuList]);

  useEffect(() => {
    // If current tag id changed, push to new path.

    const isOnlyUpdatePage = !prevActiveTagId && !activeTagId;
    const isOnlyChangeTags =
      prevActiveTagId && activeTagId && prevActiveTagId !== activeTagId;

    if (isOnlyUpdatePage) {
      // 说明是刷新了页面
      console.log("刷新页面了");
      return;
    }

    // @ts-ignore
    if (isOnlyChangeTags) {
      console.log("切换tag");
      const tag = tags.find((tag) => tag.id === activeTagId) || tags[0];
      navigate(tag.path);
    }
  }, [activeTagId]);

  useEffect(() => {
    if (pathname === "/burying") {
      dispatch(setActiveTag("1"));
    }
  }, [pathname]);

  return (
    <div id="pageTabs" style={{ background: "#fff", padding: "6px 4px" }}>
      <Tabs
        tabBarStyle={{ margin: 0 }}
        onChange={onChange}
        activeKey={activeTagId}
        type="editable-card"
        hideAdd
        onEdit={(targetKey, action) =>
          action === "remove" && onClose(targetKey as string)
        }
        tabBarExtraContent={<TagsViewAction />}
      >
        {tags.map((tag) => (
          <TabPane
            tab={tag.label[locale]}
            key={tag.id}
            closable={tag.closable}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default TagsView;
