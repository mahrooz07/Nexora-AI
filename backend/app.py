from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Personalized Planner Agent
planner_agent = Agent(
    instructions=[
        "You are a personalized planning assistant that creates detailed action plans.",
        "Analyze user goals and break them down into actionable steps with timelines.",
        "Research current market trends and incorporate them into your planning.",
        "Provide personalized recommendations based on the user's specific needs.",
        "Format your response in proper markdown with clear sections.",
        "Include market insights and web-based research in your planning.",
        "Use headers (## and ###) for organization.",
        "Provide realistic timelines and milestones.",
        "Include relevant resources and tools recommendations.",
        "Focus on current market conditions and trends from 2024-2025.",
    ],
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[DuckDuckGo()],
    show_tool_calls=True,
    markdown=True,
)

# Blog Writer Agent with Market Analysis
blog_writer_agent = Agent(
    instructions=[
        "You are a professional blog writer specializing in market trends and web analysis.",
        "Research the latest market trends and web data before writing.",
        "Create comprehensive, engaging blog posts with proper structure.",
        "Include current statistics, market insights, and trend analysis.",
        "Format your response in proper markdown with engaging headlines.",
        "Use the format: **Source**: [Title](URL) for citations.",
        "Include relevant images using: ![Description](image_url) when available.",
        "Structure blogs with: Introduction, Main Sections, Market Analysis, Conclusion.",
        "Focus on 2024-2025 market data and web trends.",
        "Make content SEO-friendly with proper headings and keywords.",
        "Include actionable insights and recommendations.",
        "End with a 'Sources and References' section.",
    ],
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[DuckDuckGo()],
    show_tool_calls=True,
    markdown=True,
)

def get_agent_response(agent, query):
    """Get response from the specified agent"""
    response = agent.run(query)
    return response.content

@app.route('/api/plan', methods=['POST'])
@cross_origin()
def create_plan():
    """Endpoint for personalized planning"""
    try:
        data = request.get_json()
        goal = data.get('goal')
        
        if not goal:
            return jsonify({"error": "No goal provided"}), 400
        
        # Create personalized plan with market research
        planning_query = f"""
        Create a personalized action plan for this goal: "{goal}"
        
        Please:
        1. Research current market trends related to this goal
        2. Break down the goal into actionable steps
        3. Provide realistic timelines and milestones
        4. Include market insights and opportunities
        5. Recommend relevant tools and resources
        6. Consider current web trends and digital landscape
        """
        
        markdown_content = get_agent_response(planner_agent, planning_query)
        
        return jsonify({
            "goal": goal,
            "plan": markdown_content,
            "type": "personalized_plan"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/blog', methods=['POST'])
@cross_origin()
def write_blog():
    """Endpoint for blog writing with market analysis"""
    try:
        data = request.get_json()
        topic = data.get('topic')
        
        if not topic:
            return jsonify({"error": "No topic provided"}), 400
        
        # Write blog with market trend analysis
        blog_query = f"""
        Write a comprehensive blog post about: "{topic}"
        
        Requirements:
        1. Research the latest market trends and data related to this topic
        2. Include current statistics and market insights from 2024-2025
        3. Analyze web trends and digital developments
        4. Create an engaging, SEO-friendly blog structure
        5. Include actionable insights and recommendations
        6. Provide proper source citations
        7. Make it informative and valuable for readers
        8. Include market analysis and future predictions
        """
        
        markdown_content = get_agent_response(blog_writer_agent, blog_query)
        
        return jsonify({
            "topic": topic,
            "blog": markdown_content,
            "type": "market_trend_blog"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/research', methods=['POST'])
@cross_origin()
def quick_research():
    """Endpoint for quick market research"""
    try:
        data = request.get_json()
        query = data.get('query')
        
        if not query:
            return jsonify({"error": "No query provided"}), 400
        
        # Quick market research
        research_query = f"""
        Research the following topic with focus on market trends: "{query}"
        
        Provide:
        1. Latest market data and statistics
        2. Current trends and developments
        3. Key insights and analysis
        4. Future predictions and opportunities
        5. Relevant sources and citations
        """
        
        markdown_content = get_agent_response(planner_agent, research_query)
        
        return jsonify({
            "query": query,
            "research": markdown_content,
            "type": "market_research"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Nexora AI API is running"})

if __name__ == '__main__':
    print("🚀 Starting Nexora AI Backend...")
    print("📊 Planner Agent: Ready")
    print("📝 Blog Writer Agent: Ready") 
    print("🔍 Research Agent: Ready")
    print("🌐 Server running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)