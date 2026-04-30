from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from app.services.embedding import embedder

def build_vector_store(resume_text):
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty or invalid")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    chunks = splitter.split_text(resume_text)

    if not chunks:
        raise ValueError("Text splitting failed: no chunks generated")

    try:
        return FAISS.from_texts(chunks, embedder)
    except Exception as e:
        raise RuntimeError(f"Vector store creation failed: {str(e)}")

def get_context(resume_text, jd):
    vs = build_vector_store(resume_text)
    docs = vs.similarity_search(jd, k=3)
    return "\n\n".join([d.page_content for d in docs])

def get_experience_context(resume_text):
    vs = build_vector_store(resume_text)

    query = """
    Find ONLY PROFESSIONAL WORK EXPERIENCE section.
    Include:
    - company
    - role
    - dates
    Exclude:
    - projects
    - education
    """

    docs = vs.similarity_search(query, k=3)
    return "\n\n".join([d.page_content for d in docs])