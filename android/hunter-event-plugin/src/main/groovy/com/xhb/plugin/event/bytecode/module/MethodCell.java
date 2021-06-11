package com.xhb.plugin.event.bytecode.module;

import java.util.List;

/**
 * Created by Jacky on 2020-05-14
 */
public class MethodCell {
    // 原方法名
    private String name;
    // 原方法描述
    private String desc;
    // 方法所在的接口或类
    private String parent;
    // 采集数据的方法名
    private String agentName;
    // 采集数据的方法描述
    private String agentDesc;
    // 采集数据的方法参数起始索引（ 0：this，1+：普通参数 ）
    private int paramsStart;
    // 采集数据的方法参数个数
    private int paramsCount;
    // 参数类型对应的ASM指令，加载不同类型的参数需要不同的指令
    private List<Integer> opcodes;

    public MethodCell(String name, String desc, String parent, String agentName, String agentDesc, int paramsStart, int paramsCount, List<Integer> opcodes) {
        this.name = name;
        this.desc = desc;
        this.parent = parent;
        this.agentName = agentName;
        this.agentDesc = agentDesc;
        this.paramsStart = paramsStart;
        this.paramsCount = paramsCount;
        this.opcodes = opcodes;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }

    public String getParent() {
        return parent;
    }

    public String getAgentName() {
        return agentName;
    }

    public String getAgentDesc() {
        return agentDesc;
    }

    public int getParamsStart() {
        return paramsStart;
    }

    public int getParamsCount() {
        return paramsCount;
    }

    public List<Integer> getOpcodes() {
        return opcodes;
    }
}
