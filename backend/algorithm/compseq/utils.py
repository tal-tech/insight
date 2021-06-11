
def search_n(s, c, n):
    r = s.find(c)
    while n > 1 and r >= 0:
        r = s.find(c, r + 1)
        n -= 1
    return r