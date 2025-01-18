from django.http import (
    HttpRequest,
)


def merge_dicts(
    a: dict,
    b: dict,
    result: dict = None
) -> dict:
    if a == {} or type(b) != dict:
        return b
    if b == {} or type(a) != dict:
        return a

    if result == None:
        result = {}
    keys = set(a.keys()).union(set(b.keys()))

    for key in keys:
        if a.get(key):
            b.setdefault(key, a[key])
        elif b.get(key):
            a.setdefault(key, b[key])
        
        if a.get(key) == b.get(key):
            result[key] = a[key]
            continue

        result[key] = merge_dicts(
            a[key],
            b[key],
            result.setdefault(key, {})
        )

    return result


def normalize_key(
    key: str,
    value,
    result: dict = None
) -> dict:
    assert type(key) == str
    
    if result == None:
        result = {}

    if "__" in key:
        normalize_key(
            key[key.index("__") + 2:],
            value,
            result.setdefault(
                key[:key.index("__")],
                {}
            )
        )
        return result
    
    result.setdefault(key, value)
    return result


def insert_to_session(
    request: HttpRequest,
    **items
) -> None:
    new_session = {}

    for key, value in request.session.items():
        new_session[key] = value

    for key, value in items.items():
        item = normalize_key(key, value)
        new_session = merge_dicts(new_session, item)
    
    for key, value in new_session.items():
        request.session[key] = value


def delete_from_session(
    request: HttpRequest,
    *keys: tuple[str]
) -> None:
    for key in keys:
        if request.session.get(key):
            request.session.pop(key)
