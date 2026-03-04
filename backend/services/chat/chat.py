import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START
from langgraph.prebuilt import ToolNode, tools_condition
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
from dotenv import load_dotenv, find_dotenv
import os

from tools.tools import web_tool, profile_reader, history_reader, urgency_detector, symptom_logger

load_dotenv(find_dotenv(".env"))

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


# Agent State

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]


# Tools

tools = [
    web_tool,
    profile_reader,
    history_reader,
    urgency_detector,
    symptom_logger,
]

# LLM

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0.5,
    api_key=GOOGLE_API_KEY
)
llm_with_tools = llm.bind_tools(tools)

# Sys Prompt

def build_system_prompt(user_id: str) -> str:
    return f"""You are DermaCare AI, a specialized assistant for skin health and dermatology.

The current user's ID is: {user_id}
Always use this ID when calling any tool that requires a user_id.

Your role:
- At the start of every conversation, call profile_reader to load the user's skin type, known conditions and allergies — use this to personalize every answer
- Call history_reader to reference the user's past scans and reports when relevant
- Always call urgency_detector on the user's message before responding — if it flags anything, prioritize that warning
- When the user describes symptoms, call symptom_logger to save them for future sessions
- Use web_tool to look up accurate, up-to-date dermatology information when needed

Strict boundaries:
- Only answer questions related to skin health, dermatology, and directly related topics
- If a question is outside this scope, politely redirect the user back to skin health topics
- Never diagnose — always clarify you are an AI assistant, not a licensed dermatologist
- For serious or urgent symptoms, always recommend seeing a real dermatologist
"""


# Agent Node

def build_agent(user_id: str):
    system = SystemMessage(content=build_system_prompt(user_id))

    def agent(state: AgentState) -> AgentState:
        response = llm_with_tools.invoke([system] + state["messages"])
        return {"messages": [response]}

    return agent


# Graph

def build_graph(user_id: str):
    tool_node = ToolNode(tools)

    graph_builder = StateGraph(AgentState)
    graph_builder.add_node("agent", build_agent(user_id))
    graph_builder.add_node("tools", tool_node)

    graph_builder.add_edge(START, "agent")
    graph_builder.add_conditional_edges("agent", tools_condition)
    graph_builder.add_edge("tools", "agent")

    return graph_builder.compile()




def chat(user_message: str, user_id: str) -> str:
    graph = build_graph(user_id)
    result = graph.invoke({"messages": [HumanMessage(content=user_message)]})
    return result["messages"][-1].content


if __name__ == "__main__":
    print(chat("What are the early signs of melanoma?", user_id="test-user-id"))
