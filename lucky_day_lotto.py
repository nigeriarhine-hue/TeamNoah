"""Lucky Day Lotto odds.

Illinois Lucky Day Lotto draws 5 numbers from a pool of 1 to 45, with no
repeats and order not mattering, so the number of distinct tickets is the
binomial coefficient C(45, 5).
"""

import math

POOL = 45
PICKS = 5


def combinations(pool: int = POOL, picks: int = PICKS) -> int:
    """Return how many distinct tickets exist for a `picks`-of-`pool` draw."""
    return math.comb(pool, picks)


def matches(hit: int, pool: int = POOL, picks: int = PICKS) -> int:
    """Return how many tickets match exactly `hit` of the drawn numbers."""
    return math.comb(picks, hit) * math.comb(pool - picks, picks - hit)


if __name__ == "__main__":
    total = combinations()
    print(f"Combinations: {total}")
    print(f"Jackpot odds: 1 in {total:,}")
    for hit in range(PICKS, 1, -1):
        ways = matches(hit)
        print(f"  {hit} of {PICKS}: {ways:>9,} tickets  (1 in {total / ways:,.1f})")
