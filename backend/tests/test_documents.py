from backend import documents


def test_all_document_types_includes_test_fixtures():
    keys = {doc.key for doc in documents.all_document_types()}

    assert {"doc-a", "doc-b"}.issubset(keys)


def test_get_document_type_returns_matching_document():
    doc = documents.get_document_type("doc-a")

    assert doc is not None
    assert doc.name == "Document A"
    assert [field.name for field in doc.fields] == ["partyName", "termOption"]


def test_get_document_type_returns_none_for_unknown_key():
    assert documents.get_document_type("nonexistent") is None
